import { UserModel } from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"

 const verifyAdmin=async(req,res,next)=>{
    try {
        // const user=await UserModel.findById(req.user?._id)
        if(req.user.role !=='admin'){
            throw new ApiError(402,"Access denied: Only Admin can access this route")
        }
        next()
    } catch (error) {
        next(error)
    }
}
export default verifyAdmin