const { validateSignUp } = require("../utils/validation");
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  console.log(req.body);

  // {
  //   firstName:"santosh",
  //   lastName:"kumar",
  //   emailId:"sahosantosh117@gmail.com",
  //   password:"123",
  //   age:23,
  //   gender:"male"
  // }

  try {
    // const isEmailValid=validator.isEmail(user.emailId);
    // const isPasswordValid=validator.isStrongPassword(user.password);
    // const isphotoUrl=validator.isURL(user.photoUrl);

    // if(!isEmailValid){
    //   throw new Error("Email is invalid");
    // }
    // if (!isPasswordValid) {
    //   throw new Error("Email is invalid");
    // }
    // if (!isphotoUrl) {
    //   throw new Error("Email is invalid");
    // }

    //validate the data
    validateSignUp(req);
    const { firstName, lastName, emailId, password } = req.body;
    //encrypt the password
    const passwordHash = await bcrypt.hash(password, 12);
    console.log(passwordHash);

    //creating a new instance of User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added sucessfully");
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(400).send("User not added");
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordMatch = await user.validatePassword(password);
    if (isPasswordMatch) {
      //create a JWT Token
      const token = await user.getJWT();

      //Add the taken to cookie send the response back to user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login sucessfully");
    } else {
      throw new Error("Invalid password");
    }
  } catch (error) {
     console.error("Error saving user:", error);
    res.status(400).send("Something went wrong");
  }
});

authRouter.post("/logout", async (req, res) => {
res.cookie("token",null,{expires:new Date(Date.now())});
res.send("Logout sucessfully");

});

module.exports = authRouter;
