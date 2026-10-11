import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.models.js";
import ApiResponse from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { emailVerificationMailGenContent, sendMail } from "../utils/mail.js";
import crypto from "crypto";


const registerUser = asyncHandler(async (req, res) => {
  const { email, username, fullname, password } = req.body;
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existingUser) {
    throw new ApiError(409, "Email or username already exist");
  }

  // generate verification token
  const unHashedToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(unHashedToken).digest("hex");
  const tokenExpiry = new Date(Date.now() + 10 * 1000 * 60);

  // create user
  const user = await User.create({
    email,
    username,
    fullname,
    password,
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: tokenExpiry,
  });

  if (!user) {
    throw new ApiError(400, "User not register");
  }

  const verificationUrl = `${process.env.CORS_ORIGIN}/api/v1/user/verify/${unHashedToken}`;
  await user.save();

  // send verification email
  try {
    await sendMail({
      email: user.email,
      subject: "Verify your email",
      mailGenContent: emailVerificationMailGenContent(user.username, verificationUrl),
    });
  } catch (error) {
    console.error("Verification email delivery failed");
    throw new ApiError(
      503,
      "Registration completed, but verification email could not be send, please try resending id.",
    );
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { userId: user._id, email: user.email },
        "Registration successful. Please check your email to verify your account",
      ),
    );
});

const verifyEmail = asyncHandler(async (req, res) => {
  const {token} = req.params;
  if (!token) {
    throw new ApiError(400, "Invalid token");
  }
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: new Date() },
  });
  if (!user) {
    throw new ApiError(400, "Invalid or expired verification token");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();
  return res.status(200).json(
    new ApiResponse(200,{},"Email verified successfully")
  )
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  //    validation
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  //    validation
});

const logoutUser = asyncHandler(async (req, res) => {
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
