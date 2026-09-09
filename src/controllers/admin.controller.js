import mongoose from "mongoose";
import { OrderModel } from "../models/order.model.js";
import ApiError from "../utils/ApiError.js";


// -------------------------------------------------------------Get all orders by Admin Only--------------------------------------------

export const getOrders = async (req, res, next) => {
  try {
    const sort = {};
    const sortBy = "createdAt";
    const sortOrder = req.query?.sortOrder || "newest";
    if (sortOrder) {
      if (sortOrder !== "newest" && sortOrder !== "oldest") {
        throw new ApiError(400, "Sort Order can only newest or oldest");
      }
      let order = 1;
      order = sortOrder == "newest" ? -1 : 1;
      sort[sortBy] = order;
    }
    const allOrders = await OrderModel.find()
      .populate("orderItems.product", "name brand category")
      .populate("orderItems.product.category")
      .populate("user", "name email -_id")
      .sort(sort);
    res.status(200).json({
      success: true,
      allOrders,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------------Update status---------------------------------------/

export const updateOrderStatus=async(req,res,next)=>{
    try {
        if(!mongoose.isValidObjectId(req.params.orderId)){
            throw  new ApiError(400,"Invalid order id")
        }
        let status=req.body?.status
        if(!status){
            throw new ApiError(400,"Please enter status to update")
        }
        status=status.toLowerCase();
        const validstatuss=["pending","confirmed","processing","shipped","delivered","cancelled"]
        if(!validstatuss.includes(status)){
            throw new ApiError(400,"invalid status")
        }
        const order=await OrderModel.findById(req.params.orderId)
        if(!order){
            throw new ApiError(404,"order not found")
        }
        if(order.orderStatus===status){
            throw new ApiError(400,`order already in ${status} state`)
        }
        const allowedTransactions={
          pending:["confirmed","cancelled"],
          confirmed:["processing","cancelled"],
          processing:["shipped","cancelled"],
          shipped:["delivered"],
          delivered:[],
          cancelled:[]
        }
        const allowedStatuses=allowedTransactions[order.orderStatus]
        if(!allowedStatuses.includes(status)){
          throw new ApiError(400,`Can't change status ${order.orderStatus} to ${status}`)
        }
        order.orderStatus=status
        await order.save()
        res.status(200).json({
            success:true,
            message:`Order status updated successfully as ${status}`,
            order
        })

    } catch (error) {
        next(error)
    }
}