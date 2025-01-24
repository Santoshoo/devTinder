-create a repository
-Initialize the repo
-node_modules,package.json,p
-CREATE A SERVER
-listen port 7777
-write request handlers for /test
-install nodemon and update
-difference between craet and tilde
-what is the use of "-g " while npm install


-order matter in routes


// const express = require('express');


// const app=express();

// // app.post("/user", (req, res) => {
// //   res.send("saved");
// // });
// // app.delete("/user", (req, res) => {
// //   res.send("deleted");
// // });
// // //this will match all the http methods
// // app.use("/about", (req, res) => {
// //   res.send("Hello Express about!");
// // });
// // app.use("/test",(req,res)=>{
// //     res.send('Hello Express!');
// // })





// //this will match only the get http method 
// // app.get("/user/:userId",(req,res)=>{
// //   console.log(req.params);
// //     res.send({firstName:'John',lastName:'Doe'});
// // });


// app.get("/user",(req,res,next)=>{
//   console.log("response!!");
//   //next();
// //res.send("1st respond");
// //if there are multiple response(route handler) send in a single route then the first response will be sent
// //if we ignore 1st respond then for go the next respond we use next() function
// next();
// }
// // (req,res)=>{
// //   console.log("response2!!");
// //   res.send("2nd respond");
// // }
// )
// app.get("/user",(req,res,next)=>{
//   console.log("responsed 2")
//   res.send("2nd")
// })
// app.listen(3000,()=>{
//     console.log('Server is up on port 3000');
// });



 //middle ware used scenerio:below two route handler are there for admin and first we have to check the authorized so do not write multiple times we crete a admin route handler where we write authorized code
 //Handle Auth middleware for all get,post
 //app.use vs app.all


 -what is middleware
 -why we need it
 -write a dummy middleware for admin and for all user routes,except login





 app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
  //logic of checking if the req is authorizied by admin

  res.send("get all data");
});
app.get("/admin/deleteUser", (req, res) => {
  //logic of checking if the req is authorizied by admin

  res.send("delete user");
});
app.get("/user", userAuth, (req, res) => {
  res.send("User data fetched");
});




-difference json vs object