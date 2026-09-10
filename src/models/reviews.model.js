import mongoose from "mongoose";
const reviewSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        trim:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true,
        trim:true
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    comment:{
        type:String,
        required:true,
        trim:true,
        maxlength:500
    }
    
},{timestamps:true})

reviewSchema.index({user:1,product:1},{unique:true});

export const ReviewModel=mongoose.model("Review",reviewSchema)