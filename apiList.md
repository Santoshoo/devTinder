#DevTinder APIs

authRouter
-POST /signup
-POST /login
-POST /logout


profileRouter
-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password


connectionRequestRouter
-POST /request/send/interested:userid
-POST /request/send/ignored/:userId
-POST/request/review/accepted/:requestId
-POST/request/review/rejected/:requestId


userRouter
-GET /user/connections
-GET /user/request/received
-GET /feed-gets you the profiles of other users on platform
