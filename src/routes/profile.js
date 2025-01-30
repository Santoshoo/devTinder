const express=require("express");
const profileRouter=express.Router();
const { userAuth } = require("../middlewares/auth");


profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong" + error.message);
  }
});


profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
  try{
if(!validateEditProfileData(req)){
  throw new Error("Invalid fields");
}
const loggedInUser=req.user;


Object.keys(req.body).forEach((key)=>{loggedInUser[key]=req.body[key];});
loggedInUser.save();
// console.log(loogedInUser);
// res.send({ message:`${loggedInUser.firstName},"Profile updated successfully",data:loggedInUser},
  
res.json({message:`${loggedInUser.firstName}Profile updated successfully`,data:loggedInUser});
  }catch(error){
    res.status(400).send("Something went wrong" + error.message);
  }
});

module.exports=profileRouter;