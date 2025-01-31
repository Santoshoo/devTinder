const express=require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest=require("../models/connectionRequest");
const User=require("../models/user");

const requestRouter=express.Router();

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
    res.json({
      message: `Connection request ${status} successfully`,
      data: data,
    });

  }catch(error){
     console.error("Error saving user:", error);
    res.status(400).send("Connection not sent" );
  }
})



module.exports=requestRouter;