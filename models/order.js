import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  ],
  amount: { type: Number, required: true },
  address: {
    // ที่อยู่จะถูกกรอกในขั้นตอน checkout
    fullname: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    province: { type: String, required: true },
    subDistrict: { type: String, required: true },
    district: { type: String, required: true },
    zipcode: { type: String, required: true },
  },
  status: { type: String, default: "Pending" },
  paymentStatus: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const orderModel = mongoose.model.order || mongoose.model("order", orderSchema);

export default orderModel;
