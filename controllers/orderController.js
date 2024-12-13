import orderModel from "../models/order.js";
import User from "../models/User.js"; // แก้ไขเป็น User แทน userModel
import Stripe from "stripe";

// global variables
const currency = "thb";
const deliveryCharge = 10;

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, cartItems, totalAmount, addressInfo } = req.body; // ใช้ cartItems และ totalAmount จาก body
    const { origin } = req.headers;

    // ตรวจสอบว่า address ถูกกรอกมาไหม
    if (
      !addressInfo ||
      !addressInfo.address ||
      !addressInfo.phone ||
      !addressInfo.city ||
      !addressInfo.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Address is incomplete.",
      });
    }

    // เตรียมข้อมูลสำหรับการสร้างคำสั่งซื้อใหม่
    const orderData = {
      userId,
      cartItems, // ใช้ cartItems ที่ส่งมา
      totalAmount, // ใช้ totalAmount ที่ส่งมา
      addressInfo, // ใช้ addressInfo ที่ส่งมา
      orderStatus: "Pending", // ตั้งค่าเริ่มต้นว่า "Pending"
      paymentMethod: "Stripe", // กำหนดเป็น Stripe
      paymentStatus: false, // กำหนดสถานะการชำระเงินเป็น false
      orderDate: Date.now(), // ใช้เวลาปัจจุบัน
    };

    // สร้าง order ใหม่
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // เตรียมข้อมูลสำหรับการสร้าง session ใน Stripe
    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.title, // ใช้ title ของสินค้า
        },
        unit_amount: item.price * 100, // ราคาเป็นเซ็นต์
      },
      quantity: item.quantity,
    }));

    // เพิ่มค่าจัดส่ง
    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharge * 100, // ค่าจัดส่ง
      },
      quantity: 1,
    });

    // สร้าง session ใน Stripe
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    // ส่งผลลัพธ์
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Verify Stripe
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;

  try {
    if (success === "true") {
      // อัปเดตสถานะคำสั่งซื้อและสถานะการชำระเงิน
      await orderModel.findByIdAndUpdate(orderId, {
        paymentStatus: true, // การชำระเงินสำเร็จ
        orderStatus: "Paid", // สถานะคำสั่งซื้อเป็น "Paid"
      });

      // รีเซ็ท cart ของผู้ใช้
      await User.findByIdAndUpdate(userId, { cartData: {} });

      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId); // หากไม่สำเร็จ ลบคำสั่งซื้อนั้น
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User Order Data For Frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update order status from Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { orderStatus: status }); // ใช้ `orderStatus` ในการอัปเดต
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { verifyStripe, placeOrderStripe, allOrders, userOrders, updateStatus };
