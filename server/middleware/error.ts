// server/middleware/error.ts

import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/ErrorHandler";


export const Errormiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // 🛑 Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid field: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // ❗ Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate value entered for ${field}: '${value}'`;
    err = new ErrorHandler(message, 400);
  }

  // ❌ Invalid JWT
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token. Please log in again.";
    err = new ErrorHandler(message, 401);
  }

  // ⏰ Expired JWT
  if (err.name === "TokenExpiredError") {
    const message = "Your token has expired. Please log in again.";
    err = new ErrorHandler(message, 401);
  }

  // 🧼 Final response
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
