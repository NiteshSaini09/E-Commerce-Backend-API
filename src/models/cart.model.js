import mongoose from "mongoose";
const cartSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    items:[
        {
            prpduct:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
            },
            quantity:{
                type:Number,
                default:1
            }
        }
    ]

},{timestamps:true})

export const CartModal=mongoose.model("Cart",cartSchema)