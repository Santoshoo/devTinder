
const jwt=require("jsonwebtoken");
const User=require("../models/user");

const userAuth = async(req, res,next) => {

try{
  //Read the token from the req cookies
  //validate the token
  //find the user by id



  const cookies = req.cookies;
  const { token } = cookies;
  if (!token) {
    return res.status(401).send("Please Login!")
  }

  const decodedObj = jwt.verify(token, process.env.JWT_SECRET);

  const { _id } = decodedObj;
  console.log(_id);

  const user = await User.findById(_id);
  console.log(user);

  if (!user) {
    throw new Error("User not found");
  }

  req.user = user;
  next();
}catch(error){
   return res.status(400).send("Please authenticate");

}

}
module.exports={
    userAuth,
}


// const jwt = require("jsonwebtoken");
// const  User  = require("../models/user");

// const userAuth = async (req, res, next) => {
//   try {
//     const cookies = req.cookies;
//     const { token } = cookies;

//     if (!token) {
//       console.error("Token not found in request cookies");
//       return res.status(400).send("Please authenticate: Token not found");
//     }

//     const decodedObj = jwt.verify(token, "DEV@Tinder$1234");
//     console.log("Decoded JWT:", decodedObj);

//     const { _id } = decodedObj;

//     const user = await User.findById(_id);
//     if (!user) {
//       console.error("User not found in database");
//       return res.status(400).send("Please authenticate: User not found");
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("Authentication Error:", error.message);
//     return res.status(400).send("Please authenticate: " + error.message);
//   }
// };


// module.exports = {
//   userAuth,
// };
