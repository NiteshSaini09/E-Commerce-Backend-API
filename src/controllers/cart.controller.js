import ApiError from "../utils/ApiError.js";
import { ProductModel } from "../models/product.model.js";
import { CartModel } from "../models/cart.model.js";
import mongoose from "mongoose";

// ----------------------Add To Cart------------------------------------------------
// export const add = async (req, res, next) => {
//   try {
//     const data={
//         user:req.user?._id,
//         items:[]
//     }
//     const item={}
//     if (req.body == undefined) {
//       throw new ApiError(400, "Please enter Product Id and quantity");
//     }
//     const productId=req.body?.productId
//     const quantity=req.body?.quantity
//     const product=await ProductModel.findById(productId)
//     if(!product){
//         throw new ApiError(404,"Product not found for add to cart")
//     }
//     item.product=productId
//     if(quantity>0){
//         item.quantity=quantity
//     }
//     data.items.push(item)

//     const isCartAlreadyCreated=await CartModel.findOne({user:req.user?._id})
//     if(isCartAlreadyCreated){
//       throw new ApiError(400,"Cart already exists")
//     }
//     const cart=await CartModel.create(data)
//     console.log("cart created")
//     // console.log(data)/

//     res.status(200).json({
//         success:true,
//         cart
//     })
    
//   } catch (error) {
//   res.status(400).json({

//   })
//     next(error);
//   }
// };


export const add=async(req,res,next)=>{
  try {
    const productId=req.body?.productId
    const quantity=req.body?.quantity
    const product=await ProductModel.findById(productId)
    if(!product){
      throw new ApiError(404,"Product Not exists")
    }
    // console.log(product.category)
    if(product.status!="active"){
      throw new ApiError(400,"Can't add product in Cart becase product is not active")
    }
    if(product.stock==0 || quantity>product.stock){
      throw new ApiError(400,"Not enough stock")
    }

    const cart=await CartModel.findOne({user:req.user?._id})
    if(!cart){
      const userCart=await CartModel.create({
        user:req.user?._id,
        items:[
          {
            product:productId,
            quantity:quantity
          }
        ]
      })
      const totalProductsInCart=userCart.items.length
      // console.log(totalProductsInCart)
      return res.status(200).json({
        success:true,
        message:"Product Added to cart Successfully",
        totalProductsInCart,
        userCart
      })
      
      // console.log(userCart)
    }
    let isProductExists=false
    for(const item of cart.items){
      if(item.product.toString()==productId){
        if(product.stock<item.quantity+quantity){
          throw new ApiError(400,"No enough stock")
        }
        item.quantity+=quantity
        await cart.save({validateBeforeSave:false})
        isProductExists=true
        break
      }
    }
    // console.log()
    const item={}
    if(!isProductExists){
      item.product=productId
      item.quantity=quantity
      cart.items.push(item)
      await cart.save()
    }

    res.status(200).json({
      success:true,
      cart
    })
  } catch (error) {
    next(error)
  }
}