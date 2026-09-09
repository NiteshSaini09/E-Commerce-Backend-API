import { OrderModel } from "../models/order.model.js";
import ApiError from "../utils/ApiError.js";

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
