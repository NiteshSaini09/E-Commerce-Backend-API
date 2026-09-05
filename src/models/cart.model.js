// import { required } from "joi";
import { required } from "joi";
import mongoose from "mongoose";
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        prpduct: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          min:1,
          required:true,
        },
      },
    ],
  },
  { timestamps: true },
);

export const CartModal = mongoose.model("Cart", cartSchema);
