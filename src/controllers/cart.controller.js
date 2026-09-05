import ApiError from "../utils/ApiError.js";
import { ProductModel } from "../models/product.model.js";
import { CartModel } from "../models/cart.model.js";
export const add = async (req, res, next) => {
  try {
    const data={
        user:req.user?._id,
        items:[]
    }
    const item={}
    if (req.body == undefined) {
      throw new ApiError(400, "Please enter Product Id and quantity");
    }
    const productId=req.body?.productId
    const quantity=req.body?.quantity
    const product=await ProductModel.findById(productId)
    if(!product){
        throw new ApiError(404,"Product not found for add to cart")
    }
    item.product=productId
    if(quantity>0){
        item.quantity=quantity
    }
    data.items.push(item)

    const isCartAlreadyCreated=await CartModel.findOne({user:req.user?._id})
    if(isCartAlreadyCreated){
      throw new ApiError(400,"Cart already exists")
    }
    const cart=await CartModel.create(data)
    console.log("cart created")
    // console.log(data)/

    res.status(200).json({
        success:true,
        cart
    })
    
  } catch (error) {
    next(error);
  }
};
