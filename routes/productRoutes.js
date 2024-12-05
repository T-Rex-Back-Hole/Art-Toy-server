import express from "express";
import {
  getAllProducts,
  singleProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

// GET All Products
productRouter.get("/list", getAllProducts);
// GET Params Product
productRouter.get('/:productId', singleProduct);

export default productRouter;
