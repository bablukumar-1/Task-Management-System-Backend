import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.models.js";
import ApiResponse from "../utils/api-response.js";
import  {ApiError}  from "../utils/api-error.js";
import { emailVerificationMailGenContent, sendMail } from "../utils/mail.js";

import crypto from "crypto";

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, fullname, password } = req.body;
console.log("EMAIL FROM REQUEST:", email);
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existingUser) {
    throw new ApiError(409, "Email or username already exist");
  }

  const user = await User.create({ email, username, fullname, password });

  console.log("EMAIL AFTER CREATE:", user.email);

  if (!user) {
    throw new ApiError(400, "User not register");
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.emailVerificationToken = token;
  user.emailVerificationExpiry = new Date(Date.now() + 10 * 60 * 1000);
  const verificationUrl = `${process.env.CORS_ORIGIN}/api/v1/user/verify/${token}`;
  await user.save();
  
  await sendMail({
      email: user.email,
      subject: "Verify your email",
      mailGenContent: emailVerificationMailGenContent(user.username, verificationUrl),
    });

  return res.status(201).json(
    new ApiResponse(201,{userId:user._id,email:user.email},"Registration successful. Please check your email to verify your account")
  )
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  //    validation
});

const logoutUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  //    validation
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  //    validation
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  //    validation
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  //    validation
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  //    validation
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  //    validation
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  //    validation
});

export {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  resendVerificationEmail,
  refreshAccessToken,
  forgotPasswordRequest,
  changeCurrentPassword,
  getCurrentUser,
};
