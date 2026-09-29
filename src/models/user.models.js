import mongoose from "mongoose";

const userSchema = new Schema({
    avatar:{
        type:{
            url:String,
            localpath:String,
        },
        default:{
            url:`https://placehold.co/600x400`,
            localpath:""
        }
    },
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
       
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        
    },
    fullname:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,

    },
    isEmailVerified:{
        type:Boolean,
        default:false

    },
    forgotPasswordToken:{
        type:String,
       
    },
    forgotPasswordExpiry:{
        type:Date,
       
    },
    refreshToken:{
        type:String,

    },
    emailVerificationToken:{
        type:String,
        
    },
    emailVerificationExpiry:{
        type:Date,

    }
})

export const User = mongoose.model("User",userSchema)