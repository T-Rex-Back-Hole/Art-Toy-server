import orderModel from "../models/order.js";
import User from "../models/user.js";
import Stripe from "stripe";

// global variables
const currency = "thb";
const deliveryCharge = 30;

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrderStripe = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.client.id; // ดึง userId จาก token

    // สร้าง line items สำหรับ Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'thb',
        product_data: {
          name: item.name,
          images: [item.image]
        },
        unit_amount: Math.round(item.price * 100), // แปลงเป็นสตางค์
      },
      quantity: item.quantity,
    }));

    // เพิ่ม line item สำหรับค่าจัดส่ง
    lineItems.push({
      price_data: {
        currency: 'thb',
        product_data: {
          name: 'Shipping Fee',
          description: 'Standard Delivery'
        },
        unit_amount: deliveryCharge * 100, // แปลง 30 บาทเป็นสตางค์
      },
      quantity: 1
    });

    // สร้าง Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/cart?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/cart?success=false`,
      shipping_address_collection: {
        allowed_countries: ['TH'],
      }
    });

    // บันทึก order
    const newOrder = new orderModel({
      userId,
      items,
      totalAmount: amount + deliveryCharge,
      shippingFee: deliveryCharge,
      address,
      paymentMethod: 'Stripe',
      paymentStatus: false,
      orderStatus: 'Pending',
      sessionId: session.id,
      orderDate: new Date()
    });

    await newOrder.save();

    res.status(200).json({
      success: true,
      session_url: session.url
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Verify Stripe
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;

  try {
    if (success === "true") {
      // อัปเดตสถานคำสั่งซื้อและสถานะการชำระเงิน
      await orderModel.findByIdAndUpdate(orderId, {
        paymentStatus: true, // การชำระเงินสำเร็จ
        orderStatus: "Paid", // ���ถานะคำสั่งซื้อเป็น "Paid"
      });

      // รีเซ็ท cart ของผู้ใช้
      await User.findByIdAndUpdate(userId, { cartData: {} });

      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId); // หากไม่สำเร็จ ลบคำสั่งซื้อนั้น
      res.json({ success: false });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
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

// update order status from Admin Panel
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
