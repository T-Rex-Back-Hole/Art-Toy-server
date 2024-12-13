import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    cartItems: {
      productId: String,
      title: String,
      image: String,
      price: String,
      quantity: Number,
    },
    totalAmount: { type: Number, required: true },
    addressInfo: {
      addressId: String,
      address: String,
      city: String,
      pincode: String,
      phone: String,
      notes: String,
    },
    orderStatus: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: Boolean, required: true, default: false },
    orderDate: { type: Date, required: true }
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
