const express = require("express");
const { connectDB } = require("./config/database");
const User=require("./models/user")
const app = express();

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
    await user.save();
    res.send("User added sucessfully");
  } catch (error) {
    res.status(400).send("User not added");
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

