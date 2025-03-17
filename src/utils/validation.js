
const validator = require('validator');


const validateSignUpData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;
    if(!firstName || !lastName){
        throw new Error(" Name is required");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is invalid");
} else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is invalid");
}
}

// const validateEditProfileData=(req)=>{
//     const allowedEditFields=["firstName","lastName","about","age","skills","photoUrl","gender"];


//    const isEditAllowed= Object.keys(req.body).every(field=>
// allowedEditFields.includes(field)
//     );
//     return isEditAllowed;
// }

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "about",
    "age",
    "skills",
    "photoUrl",
  ];
  const receivedFields = Object.keys(req.body);

  console.log("Received Fields:", receivedFields); // ✅ Debugging
  console.log("Allowed Fields:", allowedEditFields);

  const invalidFields = receivedFields.filter(
    (field) => !allowedEditFields.includes(field)
  );

  if (invalidFields.length > 0) {
    console.log("Invalid Fields Found:", invalidFields); // ✅ Debugging
    return false; // ❌ Stops processing if invalid fields exist
  }

  return true; // ✅ Validation passed
};



module.exports={validateSignUpData,
validateEditProfileData

};