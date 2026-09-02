import {v2 as cloudinary} from "cloudinary";
import dotenv from 'dotenv'
import fs from "fs"
import ApiError from "./ApiError.js";
dotenv.config()
cloudinary.config(
    {
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_API_SECRET
    }
)
const uploadOnCloudinary=async (localFilePath,folder)=>{
    try {
        if(!localFilePath){
            return null 
        }
        const result=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto",
            folder:folder
        })
        fs.unlinkSync(localFilePath)
        return result
    } catch (error) {
        if(fs.existsSync(localFilePath)){
            fs.unlinkSync(localFilePath)
        }
        console.log(`Cloudinary upload error :${err}`)
        return null
    }
}

const deleteFromCludinary=async(publicId)=>{
    try {
        const res=await cloudinary.uploader.destroy(publicId,{ invalidate: true })
        return res
    } catch (error) {
        console.log(`Error while delete image from cloudinary:${error}`)
    }
}

export {uploadOnCloudinary,deleteFromCludinary};