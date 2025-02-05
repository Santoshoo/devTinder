const express=require("express");
const userRouter=express.Router();
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest=require("../models/connectionRequest");
const User=require("../models/user");

const USER_SAFE_DATA="firstName lastName email skills";
//Get all the requests sent by the user
userRouter.get("/user/request/received",userAuth,async(req,res)=>{
    try{
const loggedInUser=req.user;
const connectionRequests=await ConnectionRequest.find({
    toUserId:loggedInUser._id,
    status:"interested"
}).populate("fromUserId",USER_SAFE_DATA);



    res.json({
        message:"Data fetched Successfully",
        data:connectionRequests});
    }catch(error){
        console.error("Error fetching user:", error);
        res.status(400).send("Error fetching user");
    }
});

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
const loggedInUser=req.user;
const connectionRequests=await ConnectionRequest.find({
    $or:[{toUserId:loggedInUser._id,status:"accepted"},
        {fromUserId:loggedInUser._id,status:"accepted"}]
    
}).populate("fromUserId",USER_SAFE_DATA)
.populate("toUserId",USER_SAFE_DATA);

const data=connectionRequests.map((row)=> {
    if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
        return row.toUserId;
    }
    return row.fromUserId;

});
   


res.json({
    mesage:"Data fetched successfully",
    data
})
    }catch(error){
        console.error("Error fetching user:", error);
        res.status(400).send("Error fetching user");
    }
});


userRouter.get("/feed",userAuth,async(req,res)=>{
    try{

        const loggedInUser=req.user;
        const page=parseInt(req.query.page) || 1;
        let limit=parseInt(req.query.limit) || 10;
        limit=limit>50?50:limit;
        const skip=(page-1)*limit;
       //show the all users except the logged in user,already sent request and already connected
       const connectionRequests=await ConnectionRequest.find({
           $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}]})
           .select("fromUserId toUserId");

           const hideUserFromFeed=new Set();
           connectionRequests.forEach((req)=>{
            
                   hideUserFromFeed.add(req.toUserId.toString());
              
                   hideUserFromFeed.add(req.fromUserId.toString());
               
           });

           const users=await User.find({
            $and:[
                {_id:{$ne:loggedInUser._id}},
                {_id:{$nin:Array.from(hideUserFromFeed)}},
               
            ]
           }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        
        res.json({
            mesage:"Data fetched successfully",
            users
        })
    }catch(error){
        console.error("Error fetching user:", error);
        res.status(400).send("Error fetching user");
    }
});

module.exports=userRouter;

