import mongoose from "mongoose";
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    postalcode: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: "India",
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: {
      type: [orderItemSchema],
      required: true,
      validate:function(item){
        return item.length>0;
      },
      message:"Order must contain at least one item"
    },
    totalAmount:{
        type:Number,
        required:true,
        min:0
    },
    orderStatus:{
        type:String,
        enum:[
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ],
        default:"pending",
        lowerCase:true
    },
    paymentStatus:{
        type:String,
        enum:[
            "pending",
            "paid",
            "failed",
        ],
        default:"pending"
    },
    shippingAddress:{
        type:[shippingAddressSchema],
        required:true
    }
  },
  { timestamps: true },
);


export const OrderModel=mongoose.model("Order",orderSchema);