import {v2 as cloudinary} from "cloudinary";
import dotenv from 'dotenv'
import fs from "fs"
dotenv.config()
cloudinary.config(
    {
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_API_SECRET
    }
)
const uploadOnCloudinary=async (localFilePath)=>{
    try {
        if(!localFilePath){
            return null
        }
        const result=await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"})
        console.log("File successfully uploaded on cloudinary")
        fs.unlinkSync(localFilePath)
        return result.url
    } catch (error) {
        if(localFilePath){
            fs.unlinkSync(localFilePath)
        }
        return null
    }
}

export default uploadOnCloudinary;