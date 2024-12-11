import productModel from "../models/product.js";

// function for list product
const getAllProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Fetch product by ID
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


export { getAllProducts, singleProduct };
