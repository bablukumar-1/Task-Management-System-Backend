import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { User } from '../models/user.models.js'; 
import { ProjectMember } from '../models/projectmember.models.js';
import mongoose from 'mongoose';
dotenv.config()

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");
  if (!token) {
    throw new ApiError(401, "Authentication is failed or not logged in");
  }

  let decode;
  try {
    decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    console.log("JWT error:", error.name, "-", error.message); 
    throw new ApiError(401, error?.message || "Invalid or expired access token"); 
  }

  const user = await User.findById(decode?.id).select("-password -refreshToken -emailVerificationToken -forgotPasswordExpiry -emailVerificationExpiry -forgotPasswordToken");
  if (!user) throw new ApiError(401, "User not found");

  req.user = user;
  next();
});



export  const validateProjectPermission = (roles = [])=>asyncHandler (async(req,res,next)=>{
    const projectId = req.params;
    if(!projectId){
      throw new ApiError(401,"Invalid or missing project id")
    }

  const project =  await ProjectMember.findOne({
      project:mongoose.Types.ObjectId(projectId),
      user:mongoose.Types.ObjectId(req.user._id)
    })
    if(!project){
      throw new ApiError(401,"Project not found")
    }

    const givenRole = project?.role;
    req.user.role = givenRole;

    if(!roles.includes(givenRole)){
      throw new ApiError(403," you do not have permission to perform action")
    }
 })