
const validator = require('validator');


const validateSignUp=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;
    if(!firstName || !lastName){
        throw new Error(" Name is required");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is invalid");
} else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is invalid");
}
}

const validateEditProfileData=(req)=>{
    const allowedEditFields=["firstName","lastName","emailId","age","skills","photoUrl"];


   const isEditAllowed= Object.keys(req.body).every((field)=>{
allowedEditFields.includes(field);
    })
    return isEditAllowed;
}


module.exports={validateSignUp,
validateEditProfileData

};