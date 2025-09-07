import dotenv from "dotenv";
dotenv.config();
import  Jwt from "jsonwebtoken";
import mongoose, { Schema, Document, Model, StringExpression } from "mongoose";
import bcrypt from "bcryptjs";

// ✅ Email validation regex
export const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ✅ Interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{
    courseId: string;
  }>;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken :() => string;
  SignRefreshToken :() => string;
}

// ✅ Schema
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Please enter your name"] },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      //required: [true, "Please enter your password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true }
);

// ✅ Hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


//Sign acess token
userSchema.methods.SignAccessToken = function () {
  return Jwt.sign({id:this._id}, process.env.ACCESS_TOKEN ||"", {expiresIn:"5m"});
  
}

//Sign refresh TOken
userSchema.methods.SignRefreshToken = function () {
  return Jwt.sign({id:this._id}, process.env.REFRESH_TOKEN ||"", {expiresIn:"3d"});
}

// ✅ Compare password method
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Model creation
const userModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default userModel;
