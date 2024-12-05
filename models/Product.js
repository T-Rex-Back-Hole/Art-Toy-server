import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: Array,
    price: Number,
    image: String,
    category: String,
    materials: String,
    product_type: String,
    description: String,
  },
  { timestamps: true }
);

const productModel =
  mongoose.model.product || mongoose.model("product", productSchema);

export default productModel;
