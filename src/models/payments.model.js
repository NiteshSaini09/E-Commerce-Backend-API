import mongoose from "mongoose"
const paymentsSchema=mongoose.Schema({},{timestamps:true})
export const PaymentsModel=mongoose.model("Payment",paymentSchema)