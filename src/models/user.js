const mongoose=require("mongoose")
const validator = require('validator'); 
const bcrypt=require("bcrypt"); const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,

      minlenght: 5,
      maxlength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is invalid");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("gender data is invalid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Virat_Kohli_with_AudiQ7.png/660px-Virat_Kohli_with_AudiQ7.png",
      validator(value) {
        if (!validator.isURL(value)) {
          throw new Error("URL is invalid");
        }
      },
    },
    about: {
      type: String,
      default: "This is default value",
    },
    skills: {
      type: ["javascript","java","react","node"],
      
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT= async function(){
const user=this;
const token=await jwt.sign({_id:user._id},"DEV@Tinder$1234",{expiresIn:"1d"});
return token;
}

userSchema.methods.validatePassword=async function(passwordInputByUser){
    const user=this;
    const passwordHash=user.password;
    const isPasswordMatch=await bcrypt.compare(passwordInputByUser,passwordHash);
    return isPasswordMatch;
}

module.exports=mongoose.model("User",userSchema)

