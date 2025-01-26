const express = require("express");
const { connectDB } = require("./config/database");
const User=require("./models/user")
const app = express();
const validator = require('validator');

app.use(express.json());
//express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in your application using the code: app.use(express.json());

app.post("/signup",async(req,res)=>{
  console.log(req.body);

  //creating a new instance of User model
  // {
  //   firstName:"santosh",
  //   lastName:"kumar",
  //   emailId:"sahosantosh117@gmail.com",
  //   password:"123",
  //   age:23,
  //   gender:"male"
  // }
  const user = new User(req.body);
  

  try {
const isEmailValid=validator.isEmail(user.emailId);
const isPasswordValid=validator.isStrongPassword(user.password);
const isphotoUrl=validator.isURL(user.photoUrl);

if(!isEmailValid){
  throw new Error("Email is invalid");
}
if (!isPasswordValid) {
  throw new Error("Email is invalid");
}
if (!isphotoUrl) {
  throw new Error("Email is invalid");
}



    await user.save();
    res.send("User added sucessfully");
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(400).send("User not added");
  }
})


app.get("/user",async(req,res)=>{
  //const userEmail=req.body.emailId;
  const userId=req.body._id;
try{
    //const user= await User.findOne({ emailId: userEmail });
    const user=await User.findById(userId);
    res.send(user);
  //   if(users.length===0){
  //  res.status(400).send("User not found");
  //   }else{
  //     res.send(users);
  //   }
  
}
catch(error){
  res.status(400).send("Something went wrong");
}
})



//Feed API-GET /feed -get all the users from database
app.get("/feed",async(req,res)=>{
  try{
const users=await User.find({});
res.send(users);
  }
  catch(error){
    res.status(400).send("Something went wrong");
  }
})

app.delete("/user",async(req,res)=>{
  const userId=req.body.userId;
  try{
const user=await User.findByIdAndDelete(userId);
res.send("User deleted sucessfully");
  }catch(error){
    res.status(400).send("Something went wrong");
  }
})


//update the data
app.patch("/user",async(req,res)=>{
  const userId=req.params.userId;
  const updateData=req.body;

  try{
    const ALLOWED_UDATES=["userId","photourl","about","skills"];
    const isUpdatedAllowed=Object.keys(upadateData).every((update)=>ALLOWED_UDATES.includes(update));
    if(!isUpdatedAllowed){
      throw new Error("Invalid updates");
    }
    if(updateData.skills.length>10){
      throw new Error("Skills cannot be more than 10");
    }
const user = await User.findByIdAndUpdate({ _id: userId }, updateData, {
  options: "before",
  runvalidators: true,
});
console.log(user);
res.send("User updated sucessfully");
  }catch(error){
    res.status(400).send("Something went wrong");
  }
})



connectDB()
  .then(() => {
    console.log("database connection sucessfully");
    app.listen(7777, () => {
      console.log("Server is up on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot connect");
  });

