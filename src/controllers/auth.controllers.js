import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.models.js";
import ApiResponse from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import {
  emailVerificationMailGenContent,
  forgotPasswordMailgenContent,
  sendMail,
} from "../utils/mail.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
  const { token } = req.params;
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
  return res.status(200).json(new ApiResponse(200, {}, "Email verified successfully"));
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  console.log("User id", userId);
  if (!userId) {
    throw new ApiError(400, "Invalid user");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isEmailVerified) {
    return res.status(200).json(new ApiResponse(200, null, "User email is already verified"));
  }

  const token = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const expiryTime = new Date(Date.now() + 10 * 60 * 1000);

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = expiryTime;

  await user.save();

  const verificationUrl = `${process.env.API_BASE_URL}/api/v1/user/verify/${token}`;

  try {
    await sendMail({
      email: user.email,
      subject: "Verify your email",
      mailGenContent: emailVerificationMailGenContent(user.username, verificationUrl),
    });
  } catch (error) {
    console.error("Resend verification email error:", error.message);

    throw new ApiError(500, "Unable to send verification email");
  }

  return res.status(200).json(new ApiResponse(200, null, "Verification email sent successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("email and pass", email, password);
  //    validation
  const user = await User.findOne({ email });
  console.log("user", user);

  //  ------ this is first way--------
  //  if(!user){
  //   throw new ApiError(404,"User not find or User not exist")
  //  }

  // const isMatched = await bcrypt.compare(password,user.password)
  //  if(!isMatched){
  //    throw new ApiError(401,"Invalid email or password")
  //  }

  // ------------ this is second way-----------
  const isMatched = user ? await bcrypt.compare(password, user.password) : false;
  console.log("ismatced", isMatched);
  if (!isMatched) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isEmailVerified) {
    throw new ApiError(403, "Please verify your email before logging in");
  }

  const jwtToken = jwt.sign({ id: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });

  user.refreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
  await user.save({ validateBeforeSave: false });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.IS_PRODUCTION === "true",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  };

  res.cookie("accessToken", jwtToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });

  res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.emailVerificationExpiry;
  delete userResponse.emailVerificationToken;

  //  user expire token time
  const decoded = jwt.decode(jwtToken);
  const hoursLeft = (decoded.exp * 1000 - Date.now()) / (1000 * 60 * 60);
  console.log("Expires in hours:", hoursLeft.toFixed(2));

  return res.status(200).json(new ApiResponse(200, userResponse, "User login successful"));
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === true,
    sameSite: "lax",
  });

  return res.status(200).json(new ApiResponse(200, null, "User logout successfully"));
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(
      200,
      null,
      "If an account exists with this email, a password reset link has been sent",
    );
  }
  if (!user.isEmailVerified) {
    throw new ApiError(403, "Please verify your email first");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  const tokenExpired = new Date(Date.now() + 10 * 60 * 1000);

  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordExpiry = tokenExpired;
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.CORS_ORIGIN}/api/v1/user/reset-password/${resetToken}`;

  try {
    await sendMail({
      email: user.email,
      subject: "Reset Your Password",
      mailGenContent: forgotPasswordMailgenContent(user.username, resetPasswordUrl),
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    console.error("Forgot password email error:", error);

    throw new ApiError(500, "Unable to send password reset email. Please try again.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { email: user.email }, "Password reset link sent successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { email, password } = req.body;
  if (!token) {
    throw new ApiError(400, "Reset token is required");
  }
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });
  if (!user) {
    throw new ApiError(400, "Reset token is invalid or has expired");
  }

  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  await user.save();

  return res.status(200).json(new ApiResponse(200, null, "Password reset successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken;
  if (!incomingToken) throw new ApiError(401, "Refresh token missing");
  console.log("refresh token", incomingToken);
  let decoded;
  try {
    decoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.id);
  const incomingHash = crypto.createHash("sha256").update(incomingToken).digest("hex");

  if (!user || user.refreshToken !== incomingHash) {
    throw new ApiError(401, "Refresh token is invalid or already used");
  }

   if (!user || user.refreshToken !== incomingHash) {
    throw new ApiError(401, "Refresh token is invalid or already used");
  }

  const newAccessToken = jwt.sign(
    { id: user._id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY  },
  );
    const cookieOptions = {
    httpOnly: true,
    secure: process.env.IS_PRODUCTION === "true",
    sameSite: "lax",
  };

  return res
    .status(200)
    .cookie("accessToken", newAccessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .json(new ApiResponse(200, null, "Access token refreshed"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "-password -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry",
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, user, "User profile loaded successfully"));
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
