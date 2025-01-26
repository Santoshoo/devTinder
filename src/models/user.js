const mongoose=require("mongoose")
const validator = require('validator'); 

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    minlenght:5,
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid");
            }
        }
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        min:18,
        
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("gender data is invalid");
        }
    },
    },
    photoUrl:{
        type:String
    },
    about:{
        type:String,
        default:"This is default value"  
    },
    skills:{
        type:[String]
    },
},{timestamps:true});

module.exports=mongoose.model("User",userSchema)

