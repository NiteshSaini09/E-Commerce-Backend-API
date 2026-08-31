import mongoose from "mongoose";

const connectDB=async()=>{
    await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`)
    console.log(`MongoDB Connection Success`)
}
export{connectDB}