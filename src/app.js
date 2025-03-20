const express = require("express");
const { connectDB } = require("./config/database");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const intializeSocket = require("./utils/socket");

require("dotenv").config();
// require("./utils/cronjob");


app.use(cors(
  {
    origin:"http://localhost:5173",
    credentials:true
  }
))
app.use(express.json());
//express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in your application using the code: app.use(express.json());
app.use(cookieParser());


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");



const http=require('http');

const server=http.createServer(app);
intializeSocket(server);





app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

connectDB()
  .then(() => {
    console.log("database connection sucessfully");
    server.listen(process.env.PORT, () => {
      console.log("Server is up on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot connect");
  });
