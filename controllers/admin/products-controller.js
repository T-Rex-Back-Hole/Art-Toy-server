import { imageUploadUtil } from "../../config/cloudinary.js";
import products from "../../models/product.js";

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);
    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};

//add a new product

const addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      image,
      category,
      materials,
      product_type,
      description,
    } = req.body;

    const newlyCreatedProduct = new products({
      name,
      price,
      image,
      category,
      materials,
      product_type,
      description,
    });
    await newlyCreatedProduct.save();
    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    const listOfProduct = await products.find({});
    res.status(200).json({
      success: true,
      data: listOfProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//edit a product

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      image,
      category,
      materials,
      product_type,
      description,
    } = req.body;

    let findProduct = await products.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    findProduct.name = name || findProduct.name;
    findProduct.price = price === "" ? 0 : price || findProduct.price;

    findProduct.image = image || findProduct.image;
    findProduct.category = category || findProduct.category;
    findProduct.materials = materials || findProduct.materials;
    findProduct.product_type = product_type || findProduct.product_type;
    findProduct.description = description || findProduct.description;

    await findProduct.save();
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//delete a product

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await products.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};



export {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
  
};
