import ApiError from "../utils/ApiError.js";
import { ProductModel } from "../models/product.model.js";
import { CartModel } from "../models/cart.model.js";
import mongoose from "mongoose";
import isEmpty from "../utils/isObjectEmpty.js";

// ----------------------Add To Cart------------------------------------------------

export const add = async (req, res, next) => {
  try {
    const productId = req.body?.productId;
    const quantity = req.body?.quantity;
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw new ApiError(404, "Product Not exists");
    }
    // console.log(product.category)
    if (product.status != "active") {
      throw new ApiError(
        400,
        "Can't add product in Cart becase product is not active",
      );
    }
    if (product.stock == 0 || quantity > product.stock) {
      throw new ApiError(400, "Not enough stock");
    }

    const cart = await CartModel.findOne({ user: req.user?._id });
    if (!cart) {
      const userCart = await CartModel.create({
        user: req.user?._id,
        items: [
          {
            product: productId,
            quantity: quantity,
          },
        ],
      });
      const totalProductsInCart = userCart.items.length;
      // console.log(totalProductsInCart)
      return res.status(200).json({
        success: true,
        message: "Product Added to cart Successfully",
        totalProductsInCart,
        userCart,
      });

      // console.log(userCart)
    }
    let isProductExists = false;
    for (const item of cart.items) {
      if (item.product.toString() == productId) {
        if (product.stock < item.quantity + quantity) {
          throw new ApiError(400, "No enough stock");
        }
        item.quantity += quantity;
        await cart.save({ validateBeforeSave: false });
        isProductExists = true;
        break;
      }
    }
    // console.log()
    const item = {};
    if (!isProductExists) {
      item.product = productId;
      item.quantity = quantity;
      cart.items.push(item);
      await cart.save();
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
};

// ----------------------Get Cart----------------------------------------------------

export const getCart = async (req, res, next) => {
  try {
    const cart = await CartModel.findOne({ user: req.user?._id })
      .select("-_id -user -items._id")
      .populate("items.product", "name price brand discount finalprice status stock");
    if (!cart) {
      throw new ApiError(404, "Cart not available, add items in cart");
    }
    let cartReport={
      issues:[],
    }
    for(let item of cart.items){
      // const isProductExists=await ProductModel.findById(item.product._id)
      if(item.product==null){
        cartReport.issues.push(`Product not exists now`)
      }
      if(item.product!==null && item.product.status=="inactive"){
        cartReport.issues.push(`Product-${item.product.name} is inactive now`)
      }
      if(item.product!==null && item.product.stock<item.quantity){
        cartReport.issues.push(`Stocks of product-${item.product.name} now is ${item.product.stock}`)
      }      
    }
    if(cartReport.issues.length==0){
      cartReport.status="ok"
    }
    const cartData = cart.toObject();
    // console.log(cartData)
    let TotalCartAmount ;
    for (let i = 0; i < cartData.items.length; i++) {
      const total = Math.ceil(
        cartData.items[i].product.finalprice * cartData.items[i].quantity,
      );
      TotalCartAmount += total;
      cartData.items[i].Amount = total;
    }
    cartData.TotalAmount = TotalCartAmount;
    // console.log(cart.items)
    const totalProductsInCart = cartData.items.length;
    res.status(200).json({
      success: true,
      Total_Products: totalProductsInCart,
      cart: cartData,
      cartReport
    });
  } catch (error) {
    next(error);
  }
};

//---------------------Update Quantity of existing product----------------------

export const updateQantity = async (req, res, next) => {
  try {
    const productId = req.body?.productId;
    let quantity = Number(req.body?.quantity);
    const user = req.user._id;
    if (!productId || !quantity) {
      throw new ApiError(
        400,
        "Please provide product id and quantity to update",
      );
    }
    const cart = await CartModel.findOne({ user }).populate(
      "items.product",
      "stock name",
    );
    if(!cart){
      throw new ApiError("404","Cart not created, add product to create cart")
    }
    let targetItem = undefined;
    for (let item of cart.items) {
      if (productId === item.product._id.toString()) {
        targetItem = item;
        break;
      }
    }
    if(!targetItem){
      throw new ApiError(404,"Product not exists in cart")
    }
    if(targetItem.quantity+quantity>targetItem.product.stock){
      throw new ApiError(400,`Not enough stock, The Total stock of product is ${targetItem.product.stock},and you trying to add ${targetItem.quantity+quantity} products`)
    }
    if(targetItem.quantity+quantity<1){
      throw new ApiError(400,`Minimum quantity can be 1, Your Current quantity is ${targetItem.quantity}`)
    }
    targetItem.quantity+=quantity
    await cart.save()
    return res.status(200).json({
      success:true,
      message:"Quantity updated",
      cart
    })
  } catch (error) {
    next(error);
  }
};

// ----------------------Delete Product from cart-------------------------------------------
export const removeProduct=async (req,res,next)=>{
  try {
    const productId=req.body?.productId
    if(!mongoose.isValidObjectId(productId)){
      throw new ApiError(401,"Invalid product id")
    }
    const cart=await CartModel.findOne({user:req.user?._id})
    if(!cart){
      throw new ApiError(404,"Cart not created at, Add products in cart first")
    }
    let targetItem=undefined
    for(let item of cart.items){
      if(item.product.toString()==productId){
        targetItem=item
        break
      }
    }
    if(!targetItem){
      throw new ApiError(400,"Product not in cart to remove")
    }
    cart.items.pull(targetItem)
    await cart.save()
    // console.log(targetItem,"product removed")
    res.status(200).json({
      success:true,
      message:"product successfully removed from cart",
      cart
    })
  } catch (error) {
    next(error)
  }
}


// -----------------------Clear Caart--------------------

export const clearCart=async(req,res,next)=>{
  try {
    const cart=await CartModel.findOne({user:req.user?._id})
    if(!cart){
      throw new ApiError(400,"There is no cart to clrear")
    }
    if(cart.items.length==0){
      throw new ApiError(400,"Cart is already clear")
    }
    cart.items.length=0
    await cart.save()
    res.status(200).json({
      success:true,
      message:"Cart cleared successfully",
      cart
    })
  } catch (error) {
    next(error)
  }
}

