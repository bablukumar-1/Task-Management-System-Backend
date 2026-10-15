import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
dotenv.config()
const isLoggedIn = asyncHandler(async ( req,res,next)=>{
try {
    let token = req.cookies.token || "";
    if(!token){
     throw new ApiError(401,"Authentication is faield")
    }

    const decode = await jwt.verify(token,process.env.JWT_SECRET_KEY)
    req.user = decode
    next()
} catch (error) {
   
    throw new ApiError(401,"Internal server error")
}
})

export default isLoggedIn