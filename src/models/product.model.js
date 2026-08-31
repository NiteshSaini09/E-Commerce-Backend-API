import { number, required, string } from "joi";
import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  name: {
    type: string,
    required: [true, "product name is required"],
    trim: true,
    min: 2,
  },
  description: {
    type: string,
    trim: true,
  },
  brand: {
    type: string,
    required: true,
    min: 2,
  },
  price: {
    type: number,
    required: true,
    min: 49,
  },
  discount: {
    type: number,
    default: 0,
  },
  finalprice: {
    type: number,
  },
  stock: {
    type: number,
    default: 1,
  },
  category: {
    type: string,
    enum: ["cloth", "shoes"],
  },
  productimages: [{ type: string }],
  status:{
    type:string,
    enum:['active','disactive']
  }
},{timestamps:true});


export const ProductModel=mongoose.model("Product",productSchema)