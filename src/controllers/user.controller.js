import { UserModel } from "../models/user.model.js"
import  ApiError  from "../utils/ApiError.js"
import mongoose from "mongoose"

export const register=async(req,res,next)=>{
    try {
        const{name,email,password}=req.body
        const isUserExists=await UserModel.findOne({email})
        if(isUserExists){
            throw new ApiError(400,"User already exists with this email")
        }
        const user=await UserModel.create({name,email,password})
        if(!user){
            throw new ApiError(500,'error while registration')
        }
        const registeredUser=await UserModel.findById(user?._id).select("-password -createdAt -updatedAt")
        res.status(201).json({
            success:true,
            message:"registration success",
            registeredUser
        })
        
    } catch (error) {
        next(error)
    }
}

export const login=async (req,res,next)=>{
    try {
        const {email,password}=req.body
        const user=await UserModel.findOne({email})
        if(!user){
            throw new ApiError(404,"Invalid email or password")
        }
        const isPasswordCorrect=await user.isPasswordCorrect(password)
        console.log(isPasswordCorrect)
        if(!isPasswordCorrect){
            throw new ApiError(400,"Invalid email or password")
        }
        const accessToken=await user.generateAccessToken()
        const refreshToken=await user.generateRefreshToken()
        user.refreshToken=refreshToken
        const options={
            httpOnly:true,
            secure:true
        }
        await user.save()
        res.status(200)
        .cookie('refreshToken',refreshToken,options)
        .cookie('accessToken',accessToken,options)
        .json({
            success:true,
            message:"User Loged in successfully",
            refreshToken,
            accessToken
        })

    } catch (error) {
        next(error)
    }
}