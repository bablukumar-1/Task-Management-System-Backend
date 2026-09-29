import mongoose, { Schema } from "mongoose";
import { AvailabelUserRoles, UserRolesEnum } from "../utils/constant.js";

const projectMemberSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    project:{
        type:Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },
    role:{
        type:String,
        enum:AvailabelUserRoles,
        default:UserRolesEnum.MEMBER,
    }
},{timestamps:true})

export const ProjectMember = mongoose.model("ProjectMember",projectMemberSchema)