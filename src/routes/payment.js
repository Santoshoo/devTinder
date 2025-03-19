const express=require('express');
const { userAuth } = require('../middlewares/auth');
const paymentRouter=express.Router();
const razorpayInstance=require('../utils/razorpay');
const Payment=require('../models/payment');
const {membershipAmount}=require('../utils/constants');
const {validateWebhookSignature,} = require("razorpay/dist/utils/razorpay-utils");
const User = require('../models/user');

paymentRouter.post("/payment/create",userAuth,async(req,res)=>{
    try{
      const {membershipType}=req.body;
      const {firstName,lastName,emailId}=req.user;
          if (!membershipType || !membershipAmount[membershipType]) {
            return res
              .status(400)
              .json({ error: "Invalid or missing membershipType" });
          }
        const order= await razorpayInstance.orders.create({
          amount: membershipAmount[membershipType]*100, // amount in the smallest currency unit
          currency: "INR",
          receipt: "receipt#1",
          partial_payment: false,
          notes: {
        firstName,
        lastName,
        emailId,
        membershipType
          },
        });

        //save the orderId in db


console.log(order);
const payment=new Payment({
    orderId:order.id,
    userId:req.user._id,
    amount:order.amount,
    currency:order.currency,
    receipt:order.receipt, 
    status:order.status,
    notes:order.notes
})
const savedPayment=await payment.save();

        //retrun back response to the client or frontend
        res.json({...savedPayment.toJSON(),keyId:process.env.RAZORPAY_KEY});

    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error"});
    }

})


paymentRouter.post("/payment/webhook",async(req,res)=>{

  try{

    const webhookSignature = req.get("x-razorpay-signature");
    const isweHookValid=validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );
    if(!isweHookValid){
      return res.status(400).json({error:"Invalid webhook signature"});
    }
    // if(req.body.event==='payment.captured'){}
    // if(req.body.event==='payment.failed'){}
//update the payment status in db
const paymentDetails=req.body.payload.payment.entity;
const payment=await Payment.findOne({orderId:paymentDetails.order_id});
payment.status=paymentDetails.status;
await payment.save();
const user=await User.findOne({_id:payment.userId});
user.isPremium=true;
user.membershipType=payment.notes.membershipType;
await user.save();


//update the user is premium

res.status(200).json({msg:"webhook received"});
  }catch(err){
    console.log(err);
    res.status(500).json({error:"Internal server error"});
  }
  
})


module.exports=paymentRouter;