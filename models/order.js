import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, required: true, default: "Order Placed" },
  paymentMethod: { type: String, require: true },
  payment: { type: Boolean, require: true, default: false },
  date: { type: Date, require: true },
});

const orderModel = mongoose.model.order || mongoose.model("order", orderSchema);

export default orderModel;
