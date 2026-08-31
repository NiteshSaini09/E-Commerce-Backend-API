import mongoose from "mongoose";
import { app } from "./src/app.js";
import { connectDB } from "./src/db/connect.db.js";

const startServer=async()=>{
    try {
        await connectDB()
        app.listen(process.env.PORT,(req,res)=>{
            console.log(`Server is listioning on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log(`Error while connecting to MongoDB or starting server\n${error.message}`)
    }
}
export {startServer}