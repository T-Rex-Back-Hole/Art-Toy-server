import userModel from "../models/User.js";
import productModel from "../models/product.js";

// add products to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    // ค้นหาข้อมูลสินค้าจาก productModel
    const productData = await productModel.findById(itemId);
    if (!productData) {
      return res.json({ success: false, message: "Product not found" });
    }
    // ค้นหาข้อมูลของผู้ใช้จาก userModel
    const user = await userModel.findById(userId);
    let cartData = user.cartData || {};
    // เช็คว่ามีสินค้านี้อยู่ใน cartData หรือไม่
    if (cartData[itemId]) {
      // ถ้ามีแล้ว เพิ่มจำนวนสินค้าขึ้น 1
      cartData[itemId].quantity += 1;
    } else {
      // ถ้าไม่มีสินค้าใน cartData ให้เพิ่มข้อมูลสินค้าลงใน cartData พร้อมจำนวน 1
      cartData[itemId] = {
        quantity: 1,
        name: productData.name,
        price: productData.price,
        image: productData.image,
        category: productData.category,
        materials: productData.materials,
        product_type: productData.product_type,
        description: productData.description,
      };
    }
    // อัปเดต cartData ของผู้ใช้ในฐานข้อมูล
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    cartData[itemId] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// get user cart data
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Log params", req.query);

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;
    console.log(cartData);

    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
