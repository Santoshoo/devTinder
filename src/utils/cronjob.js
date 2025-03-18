const cron= require('node-cron');
const {subDays,startOfDay,endOfDay}=require("date-fns");
const ConnectionRequestSchemaModel = require('../models/connectionRequest');
const sendEmail=require('./sendEmail');


cron.schedule("  11 21 * * *",async()=>{
    //console.log("Running a task at 8:00 AM" +new Date());
    // console.log("Running a task at 8:00 AM" +new Date());
    //send email for there are pending request
    //get all request that are pending
    //send email to the user


try{
        const yesterday = subDays(new Date(), 1);

        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequests = await ConnectionRequestSchemaModel.find({
          status: "interested",
          createdAt: {
            $gte: yesterdayStart,
            $lte: yesterdayEnd,
          },
        }).populate("fromUserId toUserId");

        const listOfEmails = [
          ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
        ];

        for (const email of listOfEmails) {
          //send email
          try {
            const res = await sendEmail.run(
              "New friend Requests pending for " +email,
              "You have pending friend request, please login to your account to check the request"
            );
            console.log(res);
          } catch (e) {
            console.log(e);
          }
        }
    
}catch(err){
    console.log(err);
}



})