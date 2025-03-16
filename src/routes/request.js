const express=require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest=require("../models/connectionRequest");
const User=require("../models/user");

const requestRouter=express.Router();

const sendEmail=require("../utils/sendEmail");

requestRouter.post("/request/send/:status/:touserId", userAuth, async (req, res) => {
  try{
    const fromUserId = req.user._id;
    const toUserId = req.params.touserId;
    const status = req.params.status;

    const allowedStatus=["ignored","interested"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({message:"Invalid status"});  
    }


    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const toUser=await User.findById(toUserId);
    if(!toUser){
      return res.status(400).json({message:"User not found"});  
    }
    // if(fromUserId.toString()===toUserId.toString()){
    //   return res.status(400).json({message:"You cannot send request to yourself"});  
    // }
const existingRequest=await ConnectionRequest.findOne({
  $or:
  [{fromUserId,toUserId},
    {fromUserId:toUserId,toUserId:fromUserId}]});
if(existingRequest){
  return res.status(400).json({message:"Request already sent"});
}
    //$or:[{fromUserId:fromUserId,toUserId:toUserId},{fromUserId:toUserId,toUserId:fromUserId}]
    const data = await connectionRequest.save();
const emailRes = await sendEmail.run("A friend request from",
  `${fromUserId} send ${status}  request  to ${toUserId} successfully`,
);
console.log("Email sent",emailRes);


    res.json({
      message: `${fromUserId} send ${status}  request  to ${toUserId} successfully`,
      data: data,
    });

  }catch(error){
     console.error("Error saving user:", error);
    res.status(400).send("Connection not sent" );
  }
})


requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{


  try{
    const loggedInUser = req.user;
    const { status, requestId } = req.params;
    //validate the status
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    //vivek=>elon
    //loggedInId=toUserID
    //status=interested
    //requested id should be valid or present in the db
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    })
    if(!connectionRequest){
      return res.status(404).json({message:"Connection not found"});
    }
    connectionRequest.status=status;
    const data=await connectionRequest.save();
    res.json({
      message: `Connection request ${status} successfully`,
      data: data,})
  }
  catch(error){
    console.error("Error saving user:", error);
    res.status(400).send("Connection not sent" );
  }
});



module.exports=requestRouter;