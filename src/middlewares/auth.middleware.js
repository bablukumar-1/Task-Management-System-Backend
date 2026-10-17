import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { User } from '../models/user.models.js'; 
dotenv.config()

const isLoggedIn = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    throw new ApiError(401, "Authentication is failed or not logged in");
  }

  let decode;
  try {
    decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    console.log("JWT error:", error.name, "-", error.message); 
    throw new ApiError(401, "Invalid or expired access token"); }

  const user = await User.findById(decode.id).select("-password -refreshToken");
  if (!user) throw new ApiError(401, "User not found");

  req.user = user;
  next();
});

export default isLoggedIn