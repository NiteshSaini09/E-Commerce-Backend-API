import { CartModel } from "../models/cart.model.js"
import { OrderModel } from "../models/order.model.js"
import { ProductModel } from "../models/product.model.js"
import ApiError from "../utils/ApiError.js"

export const makeOrder=async(req,res,next)=>{
    try {
        const realCart=await CartModel.findOne({user:req.user?._id}).populate("items.product","name stock price finalprice status")
        if(!realCart){
            throw new ApiError(400,"Cart not created, Add products in cart to create Cart and make order")
        }
        if(!req.body){
            throw new ApiError(400,"Enter Shipping Address")
        }
        const {fullname,phone,address,city,state,postalcode,country}=req.body
        let cart=realCart.toObject()
        // console.log(cart)
        if(cart.items.length==0){
            throw new ApiError(400,"Cart is empty, Add products to cart")
        }
        let totalCartAmount=0
        let productIndex=1
        for(let item of cart.items){
            if(item.product==null){
                throw new ApiError(400,`Product ${productIndex} is not available,Please remove it from cart`)
            }
            if(item.product.status=="inactive"){
                throw new ApiError(400,`${item.product.name} is not active to make order,Please remove it from cart`)
            }
            if(item.product.stock< item.quantity){
                throw new ApiError(400,`Not enough stock, Only ${item.product.stock} ${item.product.name} is in stock, please reduce quantity`)
            }
            item.total=item.product.finalprice*item.quantity
            // console.log(item)
            totalCartAmount+=item.total
            productIndex++
        }
        const orderItemsData=[]
        for(let item of cart.items){
            orderItemsData.push({
                product:item.product._id,
                quantity:item.quantity,
                price:item.product.finalprice,
                total:item.total
            })
        }
        // console.log(req.user._id)
        const orderData={
            user:req.user._id,
            orderItems:orderItemsData,
            totalAmount:totalCartAmount,
            orderStatus:"pending",
            paymentStatus:"pending",
            shippingAddress:{fullname,phone,address,city,state,postalcode,country}
        }
        const order=await OrderModel.create(orderData)
        let message
        if(order){
            realCart.items=[]
            for(let orderItem of order.orderItems){
                const productId=orderItem.product
                const product=await ProductModel.findById(productId)
                product.stock-=orderItem.quantity
                await product.save()
            }
            await realCart.save()
            message="Order Placed"
        }else{
            message="Error while place order"
        }

        res.status(201).json({
            success:true,
            message,
            orderSummary:order
        })

    } catch (error) {
        next(error)
    }
}