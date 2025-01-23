const express = require('express');


const app=express();
app.use("/", (req, res) => {
  res.send("Hello Express dashboard!");
});

app.use("/test",(req,res)=>{
    res.send('Hello Express!');
})
app.listen(3000,()=>{
    console.log('Server is up on port 3000');
});


