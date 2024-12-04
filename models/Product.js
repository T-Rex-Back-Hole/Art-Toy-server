import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: Array, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    materials: { type: String, required: true },
    product_type: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const productModel =
  mongoose.model.product || mongoose.model("product", productSchema);

export default productModel;
