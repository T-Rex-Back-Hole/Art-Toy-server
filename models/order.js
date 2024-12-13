import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [
      {
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String
      }
    ],
    totalAmount: { type: Number, required: true },
    address: {
      fullname: String,
      phoneNumber: String,
      province: String,
      district: String,
      subDistrict: String,
      zipcode: String,
      notes: String
    },
    paymentMethod: { type: String, default: 'Stripe' },
    paymentStatus: { type: Boolean, default: false },
    orderStatus: { 
      type: String, 
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Payment Failed'],
      default: 'Pending',
      required: true 
    },
    sessionId: String,
    orderDate: { type: Date, default: Date.now, required: true },
    paymentFailedAt: {
      type: Date,
      default: null
    }
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
