import express from "express";
import { upload } from "../../config/cloudinary.js";

import {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
  getFilteredProducts,
} from "../../controllers/admin/products-controller.js";

const adminProductsRouter = express.Router();

adminProductsRouter.post(
  "/upload-image",
  upload.single("my_file"),
  handleImageUpload
);
adminProductsRouter.post("/add", addProduct);
adminProductsRouter.put("/edit/:id", editProduct);
adminProductsRouter.delete("/delete/:id", deleteProduct);
adminProductsRouter.get("/get", fetchAllProducts);
adminProductsRouter.get("/get/filtered", getFilteredProducts);

export default adminProductsRouter;
