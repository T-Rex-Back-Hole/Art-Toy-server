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
      success_url: `${process.env.FRONTEND_URL}/cart?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart?success=false`,
      shipping_address_collection: {
        allowed_countries: ['TH'],
      }
    });

    // บันทึกข้อมูลออเดอร์
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
  const { sessionId } = req.body;

  try {
    // ตรวจสอบ session กับ Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      // ค้นหา order ด้วย sessionId
      const order = await orderModel.findOne({ sessionId });
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      // อัปเดตสถานะการชำระเงินและออเดอร์
      await orderModel.findByIdAndUpdate(order._id, {
        paymentStatus: true,
        orderStatus: "Paid"
      });

      // รีเซ็ท cart ของผู้ใช้
      await User.findByIdAndUpdate(order.userId, { cartData: {} });

      return res.json({ 
        success: true,
        message: "Payment verified successfully"
      });

    } else {
      return res.status(400).json({
        success: false,
        message: "Payment not completed"
      });
    }

  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error verifying payment"
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
