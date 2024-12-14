import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  cartItems: [
    {
      productId: String,
      quantity: Number,
      name: String,
      price: String,
      image: String,
      category: String,
      materials: String,
      product_type: String,
      description: String,
    },
  ],
  totalAmount: { type: Number, required: true },
  addressInfo: {
    addressId: String,
    address: String,
    city: String,
    zipcode: String,
    phone: String,
    notes: String,
  },
  orderStatus: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: Boolean, required: true, default: false },
  orderDate: { type: Date, required: true },
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
