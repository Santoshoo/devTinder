// const { validateSignUp } = require("../utils/validation");
// const express = require("express");
// const bcrypt = require("bcrypt");
// const User = require("../models/user");
// const authRouter = express.Router();

// authRouter.post("/signup", async (req, res) => {
//   console.log(req.body);

//   // {
//   //   firstName:"santosh",
//   //   lastName:"kumar",
//   //   emailId:"sahosantosh117@gmail.com",
//   //   password:"123",
//   //   age:23,
//   //   gender:"male"
//   // }

//   try {
//     // const isEmailValid=validator.isEmail(user.emailId);
//     // const isPasswordValid=validator.isStrongPassword(user.password);
//     // const isphotoUrl=validator.isURL(user.photoUrl);

//     // if(!isEmailValid){
//     //   throw new Error("Email is invalid");
//     // }
//     // if (!isPasswordValid) {
//     //   throw new Error("Email is invalid");
//     // }
//     // if (!isphotoUrl) {
//     //   throw new Error("Email is invalid");
//     // }

//     //validate the data
//     validateSignUp(req);
//     const { firstName, lastName, emailId, password } = req.body;
//     //encrypt the password
//     const passwordHash = await bcrypt.hash(password, 12);
//     console.log(passwordHash);

//     //creating a new instance of User model
//     const user = new User({
//       firstName,
//       lastName,
//       emailId,
//       password: passwordHash,
//     });
//     const savedUser=await user.save();
//           const token = await savedUser .getJWT();

//           //Add the taken to cookie send the response back to user
//           res.cookie("token", token, {
//             expires: new Date(Date.now() + 8 * 3600000),
//           });
//     res.json({message:"User added sucessfully",data:savedUser});
//   } catch (error) {
//     console.error("Error saving user:", error);
//     res.status(400).send("User not added");
//   }
// });

// authRouter.post("/login", async (req, res) => {
//   try {
//     const { emailId, password } = req.body;
//     const user = await User.findOne({ emailId: emailId });
//     if (!user) {
//       throw new Error("User not found");
//     }
//     const isPasswordMatch = await user.validatePassword(password);
//     if (isPasswordMatch) {
//       //create a JWT Token
//       const token = await user.getJWT();

//       //Add the taken to cookie send the response back to user
//       res.cookie("token", token, {
//         expires: new Date(Date.now() + 8 * 3600000),
//       });
//       res.send(user);
//     } else {
//       res.status(400).send("Invalid  credentials");
//     }
//   } catch (error) {
//      console.error("Error saving user:", error);
//     res.status(400).send("Something went wrong");
//   }
// });
// authRouter.post("/logout", async (req, res) => {
// res.cookie("token",null,{expires:new Date(Date.now())});
// res.send("Logout sucessfully");
// });



// module.exports = authRouter;




const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    //   Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful!!");
});

module.exports = authRouter;
