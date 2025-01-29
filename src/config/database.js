

const mongoose=require("mongoose")
const connectDB=async ()=>{
    await mongoose.connect(
      "mongodb+srv://santoshsahoo4013:AybNOmtoQiiCZUSL@nodeproject.qoj57.mongodb.net/devTinder"
     
    );
}

module.exports={connectDB};

