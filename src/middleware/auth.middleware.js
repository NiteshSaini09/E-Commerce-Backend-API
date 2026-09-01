import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { UserModel } from "../models/user.model.js";
export const verifyJWT=async(req,res,next)=>{
    try {
        const token=req.cookies?.accessToken 
        // || req?.header("Authorization").replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"Unauthosized request, Please login first")
        }
        const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user=await UserModel.findById(decodedToken?._id)
        if(!user || !decodedToken){
            throw new ApiError(400,'Invalid Token')
        }
        req.user=user
        next()
    } catch (error) {
        next(error)
    }

}
export default verifyJWT
