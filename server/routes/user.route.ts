// server/routes/user.route.ts

import express from "express";
import { activateUser, getUserInfo, loginUser, logoutUser, registrationUser, socialAuth, updateAccessToken } from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";


const userRouter = express.Router();

// Base test route
// userRouter.get("/", (req, res) => {
//   res.status(200).json({ message: "User base route is working!" });
// });

userRouter.get("/", (req, res) => {
  console.log("✅ GET /api/v1 reached");
  res.status(200).json({ message: "User base route is working!" });
});


// Registration route
// userRouter.post("/ping", (req, res) => {
//   console.log("✅ POST /api/v1/ping reached");
//   res.status(200).json({ message: "Pong from registration API" });
// });

// userRouter.get("/ping", (req, res) => {
//   res.status(200).json({ message: "Ping route (GET) working!" });
// });

userRouter.post("/registration", registrationUser);

userRouter.post("/activate", activateUser);

userRouter.post("/login", loginUser);

userRouter.get("/logout", isAuthenticated,logoutUser);

userRouter.get("/refresh", updateAccessToken);

userRouter.get("/me", isAuthenticated,getUserInfo);

userRouter.post("/socialAuth", socialAuth);

export default userRouter;
