import { validationResult } from "express-validator";
import ApiError from "../utils/api-error.js"
export const validate = (req,res,next)=>{
    const errors = validationResult(req)
    if(errors.isEmpty()){
        return next()
    }

    const extractError = []
    errors.map((err)=>extractError.push({
        [errpath]:err.msg
    }))

     throw new ApiError(422,"Recieved data is not valid", extractError)

}