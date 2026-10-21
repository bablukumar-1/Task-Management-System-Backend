import mongoose, { mongo } from "mongoose";
import { ProjectNote } from "../models/note.models.js";
import { Project } from "../models/project.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import ApiResponse from "../utils/api-response.js";


const getNotes = asyncHandler( async(req,res)=>{
    const {projectId} = req.params;
    if(!projectId){
        throw new ApiError(401,"ProjectId is missing..!")
    }

    const project = await Project.findById(projectId)
    if(!project){
        throw new ApiError(404,"Project not found")
    }

    const notes = await ProjectNote.find({
        project: new mongoose.Types.ObjectId(projectId)
    }).populate("createdBy", "username fullname avatar")

    return res.status(200).json(
        new ApiResponse(200,notes,"Notes fetched successfully")
    )
})

const getNoteById = asyncHandler (async (req,res)=>{
    const {noteId} = req.params;
    if(!noteId){
        throw new ApiError(401,"Project id is missing")
    }

    const note = await ProjectNote.findById(noteId).populate("createdBy","username fullname avatar")

    if(!note){
        throw new ApiError(404,"Note is not found")
    }
     return res.status(200).json(
        new ApiResponse(200,note,"Note fetched successfully")
    )
})

const createNote = asyncHandler (async(req,res)=>{
    const {projectId} = req.params;
    const {content} = req.body;

    const project = await Project.findById(projectId)
    if(!project){
        throw new ApiError(404,"project not found")
    }

    const note = await Project.create({
        project:new mongoose.Types.ObjectId(projectId),
       content:content,
       createdBy:new mongoose.Types.ObjectId(req.user._id)
    })

    const populatedNotes = await ProjectNote.findById(note._id).populate("createdBy","username fullname avatar")

     return res.status(200).json(
        new ApiResponse(200,populatedNotes,"Note created successfully")
    )

})


const updateNote = asyncHandler ( async(req,res)=>{
    const {noteId} = req.params;
    const {content} = req.body;
    const existingNote = await ProjectNote.findById(noteId)
    if(!existingNote){
        throw new ApiError(404, "not not found")
    }

    const updatedNote = await ProjectNote.findByIdAndUpdate(
        noteId,
        {content},
        {new:true}
    ).populate("createdBy", "username fullname avatar")

    return res.status(200).json(
        new ApiResponse(200, updatedNote,"Note updated successfully")
    )

})


const deletedNote = asyncHandler ( async(req,res)=>{
    const {noteId}=req.pparams;

    const note = await ProjectNote.findById(noteId)
    if(!note){
        throw new ApiError(404,"Note not found")
    }

    const deletedNote = await ProjectNote.findByIdAndDelete(noteId)

    if(!deletedNote){
        throw new ApiError(401,"Notes not deleted")
    }
    return res.status(200).json(
        new ApiResponse(200,null,"Note deleted successfully")
    )
})
export {getNotes, getNoteById,createNote,updateNote,deletedNote}