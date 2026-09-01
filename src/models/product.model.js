import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "product name is required"],
      trim: true,
      minlength: 2,
    },
    description: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      minlength: 2,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
      min:0,
      max:100
    },
    finalprice: {
      type: Number,
    },
    stock: {
      type: Number,
      default: 0,
      min:0
    },
    category: {
      type: String,
      enum: [
        "item",
        "cloth",
        "shoes",
        "mobile",
        "laptop",
        "electronics",
        "beauty",
        "furniture",
      ],
      default:"item"
    },
    productimages: [{ type: String }],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default:"active"
    },
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
    }
  },
  { timestamps: true },
);
productSchema.pre('save',async function() {
  if(this.isModified('price') || this.isModified("discount")){
    this.finalprice=this.price-(this.price*this.discount/100)
    return
  }
  return
})

export const ProductModel = mongoose.model("Product", productSchema);
