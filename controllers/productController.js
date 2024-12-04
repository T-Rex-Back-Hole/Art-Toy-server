import productModel from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";

// function for add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    // Handling multiple images uploaded through multer (ensure multer is used)
    const image1 = req.files?.image1 && req.files.image1[0];
    const image2 = req.files?.image2 && req.files.image2[0];
    const image3 = req.files?.image3 && req.files.image3[0];
    const image4 = req.files?.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    // Upload images to Cloudinary and get the URLs
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        try {
          let result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image", // Important to specify the resource type
          });
          return result.secure_url;
        } catch (err) {
          console.error("Error uploading to Cloudinary", err);
          throw new Error("Error uploading to Cloudinary");
        }
      })
    );

    // Creating product data
    const productData = {
      name,
      description,
      category,
      price: Number(price), // Ensure price is a number
      subCategory,
      bestseller: bestseller === "true", // Convert bestseller to boolean
      sizes: JSON.parse(sizes), // Parse the sizes to an array or object
      image: imagesUrl, // Store the URLs from Cloudinary
      date: Date.now(),
    };

    console.log(productData);

    // Saving product to the database
    const product = new productModel(productData);
    await product.save();

    // Sending success response
    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// function for list product
const listProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// function for removing product
const removeProduct = async (req, res) => {
  try {
    // Delete product by ID
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    // Fetch product by ID
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export { listProducts, addProduct, removeProduct, singleProduct };
