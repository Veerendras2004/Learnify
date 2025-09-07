require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {Errormiddleware} from "./middleware/error";
import userRouter from "./routes/user.route";
import { activateUser } from "./controllers/user.controller";
export const app = express();


console.log("🟢 App started");
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl}`);
  next();
});



// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

//Routes
app.use("/api/v1",userRouter);


// Test API
app.get("/:est", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: `API is working with param: ${req.params.est}`,
  });
});

// Catch unknown routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err: any = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});


