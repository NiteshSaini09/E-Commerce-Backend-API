import mongoose from "mongoose";
import { CartModel } from "../models/cart.model.js";
import { OrderModel } from "../models/order.model.js";
import { ProductModel } from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";

// ---------------------------------Make Order--------------------------------------------------------------------

export const makeOrder = async (req, res, next) => {
  try {
    const realCart = await CartModel.findOne({ user: req.user?._id }).populate(
      "items.product",
      "name stock price finalprice status",
    );
    if (!realCart) {
      throw new ApiError(
        400,
        "Cart not created, Add products in cart to create Cart and make order",
      );
    }
    if (!req.body) {
      throw new ApiError(400, "Enter Shipping Address");
    }
    const { fullname, phone, address, city, state, postalcode, country } =
      req.body;
    let cart = realCart.toObject();
    // console.log(cart)
    if (cart.items.length == 0) {
      throw new ApiError(400, "Cart is empty, Add products to cart");
    }
    let totalCartAmount = 0;
    let productIndex = 1;
    for (let item of cart.items) {
      if (item.product == null) {
        throw new ApiError(
          400,
          `Product ${productIndex} is not available,Please remove it from cart`,
        );
      }
      if (item.product.status == "inactive") {
        throw new ApiError(
          400,
          `${item.product.name} is not active to make order,Please remove it from cart`,
        );
      }
      if (item.product.stock < item.quantity) {
        throw new ApiError(
          400,
          `Not enough stock, Only ${item.product.stock} ${item.product.name} is in stock, please reduce quantity`,
        );
      }
      item.total = item.product.finalprice * item.quantity;
      // console.log(item)
      totalCartAmount += item.total;
      productIndex++;
    }
    const orderItemsData = [];
    for (let item of cart.items) {
      orderItemsData.push({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.finalprice,
        total: item.total,
      });
    }
    // console.log(req.user._id)
    const orderData = {
      user: req.user._id,
      orderItems: orderItemsData,
      totalAmount: totalCartAmount,
      orderStatus: "pending",
      paymentStatus: "pending",
      shippingAddress: {
        fullname,
        phone,
        address,
        city,
        state,
        postalcode,
        country,
      },
    };
    const order = await OrderModel.create(orderData);
    let message;
    if (order) {
      realCart.items = [];
      for (let orderItem of order.orderItems) {
        const productId = orderItem.product;
        const product = await ProductModel.findById(productId);
        product.stock -= orderItem.quantity;
        await product.save();
      }
      await realCart.save();
      message = "Order Placed";
    } else {
      message = "Error while place order";
    }

    res.status(201).json({
      success: true,
      message,
      orderSummary: order,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------My Orders----------------------------------------------------------------

export const myOrders = async (req, res, next) => {
  try {
    const myOrders = await OrderModel.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("orderItems.product", "-price");
    const pendingOrders = await OrderModel.find({
      user: req.user._id,
      orderStatus: "pending",
    });
    const deliveredOrders = await OrderModel.find({
      user: req.user._id,
      orderStatus: "delivered",
    });
    const canceledOrders = await OrderModel.find({
      user: req.user._id,
      orderStatus: "canceled",
    });
    // console.log(myOrders)
    let message;
    if (myOrders.length == 0) {
      message = "No Order history";
    } else {
      message = "Your Order history available";
    }
    res.status(200).json({
      message,
      total_Orders: myOrders.length,
      pending_Orders: pendingOrders.length,
      delivered_Orders: deliveredOrders.length,
      canceled_Orders: canceledOrders.length,
      order_History: myOrders,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------My Order By Id-------------------------------------------

export const myOrderById = async (req, res, next) => {
  try {
    const orderId = req.params?.orderId;
    if (!mongoose.isValidObjectId(orderId)) {
      throw new ApiError(400, "Invalid order id");
    }
    const order = await OrderModel.findOne({
      user: req.user._id,
      _id: orderId,
    }).populate("orderItems.product", "-price");
    if (!order) {
      throw new ApiError(404, "Order Not Found");
    }
    res.status(200).json({
      success: true,
      message: "Order retrived successfull",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------------Cancle Order ------------------------------------------------------------

export const cancelOrder = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    if (!mongoose.isValidObjectId(orderId)) {
      throw new ApiError(400, "Invalid orderId");
    }
    const order = await OrderModel.findOne({
      user: req.user._id,
      _id: orderId,
    }).populate("orderItems.product", "-price");
    if (!order) {
      throw new ApiError(400, "Order not found to cancel");
    }
    // if (order.orderStatus === "shipped") {
    //   throw new ApiError(400, "Can't cancel order after order shipped");
    // }
    // if (order.orderStatus === "delivered") {
    //   throw new ApiError(400, "Can't cancel, because order is delivered");
    // }
    // if (order.orderStatus === "cancelled") {
    //   throw new ApiError(400, "order already cancelled");
    // }
    if (order.orderStatus !== "pending" && order.orderStatus !== "confirmed") {
      throw new ApiError(
        400,
        "Order only canceled in pending or confirmed state",
      );
    }
    for (let orderItem of order.orderItems) {
      if (orderItem.product !== null) {
        const product = await ProductModel.findById(orderItem.product._id);
        console.log(product.stock + orderItem.quantity);
        product.stock += orderItem.quantity;
        await product.save();
      }
    }
    order.orderStatus = "cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled Successfully",
      cancled_Order: order,
    });
  } catch (error) {
    next(error);
  }
};
