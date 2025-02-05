const express = require("express");
const { connectDB } = require("./config/database");

const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
//express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in your application using the code: app.use(express.json());
app.use(cookieParser());


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
