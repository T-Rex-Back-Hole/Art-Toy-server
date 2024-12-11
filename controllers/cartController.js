import userModel from "../models/user.js";
import productModel from "../models/product.js";

// add products to user cart
const addToCart = async (req, res) => {
  try {
    const { itemId } = req.body;
    const { id } = req.client;

    // ค้นหาข้อมูลสินค้าจาก productModel
    const productData = await productModel.findById(itemId);

    if (!productData) {
      return res.json({ success: false, message: "Product not found" });
    }

    // ค้นหาข้อมูลของผู้ใช้จาก userModel
    const user = await userModel.findById(id);
    let cartData = user.cartData || {}; // เพิ่มการตรวจสอบกรณีที่ cartData ไม่มี

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
    await userModel.findByIdAndUpdate(id, { cartData });

    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update user cart
const updateCart = async (req, res) => {
  try {
    const { id, itemId, quantity } = req.body;

    // ตรวจสอบ quantity
    if (quantity < 1) {
      return res.json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const userData = await userModel.findById(id);
    let cartData = userData.cartData || {}; // เพิ่มการตรวจสอบกรณีที่ cartData ไม่มี

    // อัปเดตจำนวนสินค้าภายใน cartData
    if (cartData[itemId]) {
      cartData[itemId].quantity = quantity;
    }

    // อัปเดต cartData ของผู้ใช้ในฐานข้อมูล
    await userModel.findByIdAndUpdate(id, { cartData });
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

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {}; // เพิ่มการตรวจสอบกรณีที่ cartData ไม่มี

    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const removeCart = async (req, res) => {
  try {
    const { itemId } = req.query; // รับ userId และ itemId จาก URL parameters หรือ body

    const userId = req.client.id;

    // ค้นหาผู้ใช้ในฐานข้อมูล
    const userData = await userModel.findById(userId);

    console.log("Log userdata => ", userData);

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // ตรวจสอบว่ามี cartData หรือไม่

    let cartData = userData.cartData;
    if (cartData[itemId]) {
      delete cartData[itemId];
    } else {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }
    // Update user's cart
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { cartData },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Cart item updated",
      cart: updatedUser.cartData,
    });

    // บันทึกข้อมูลผู้ใช้หลังจากอัปเดตตะกร้า
    await userData.save();

    // ส่งข้อมูลตะกร้าหลังจากการลบสินค้า
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart, removeCart };
