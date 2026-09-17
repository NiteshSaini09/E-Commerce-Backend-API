import mongoose from "mongoose"
const paymentsSchema=mongoose.Schema({
amount:Number,
paymentOrder:{
type: mongoose.Schema.Types.ObjectId,
ref:"Order"
}

},{timestamps:true})
export const PaymentsModel=mongoose.model("Payment",paymentSchema)