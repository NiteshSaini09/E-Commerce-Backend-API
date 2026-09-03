import { string } from "joi";
import mongoose from "mongoose";
const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        minlength:2,
        maxlength:30
    },
    description:{
        type:string,
        trim:true,
        maxlength:500
    },
    image:{
        type:String,
        default:null
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

export const CategoryModel=mongoose.model("Category",categorySchema)