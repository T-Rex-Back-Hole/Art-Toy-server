import userModel from "../models/User.js";
import productModel from "../models/product.js";

// add products to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    console.log("Log userId",userId)

    const userData = await userModel.findById(userId);
    const productData = await productModel.findById(itemId);
    const cartData = productData
    delete cartData._id

    if (cartData[itemId]) {
      if (cartData[itemId]) {
        cartData[itemId] += 1;
      } else {
        cartData[itemId] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId] = 1;
    }

    await userModel.findByIdAndUpdate(userId, {cartData:productData});

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
    console.log("Log params", req.query)

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
