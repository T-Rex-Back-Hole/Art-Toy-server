import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
  },
  { minimize: false }
);

const addressModel =
  mongoose.models.client || mongoose.model("client", addressSchema);

export default addressModel;
