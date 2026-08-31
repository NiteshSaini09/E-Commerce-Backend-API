import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middleware/errorHandler.middleware.js'
const app=express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.send("e commerse app is running")
})


app.use(errorHandler)
export {app}