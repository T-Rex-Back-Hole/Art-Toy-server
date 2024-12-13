import orderModel from "../models/order.js";
import userModel from "../models/user.js";
import Stripe from "stripe";

// global variables
const currency = "thb";
const deliveryCharge = 10;

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.client.id;

    console.log('Creating order with:', { items, amount, address, userId });

    // สร้าง line items สำหรับ Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'thb',
        product_data: {
          name: item.name,
          images: [item.image]
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // สร้าง Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/cart?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/cart?success=false`,
      shipping_address_collection: {
        allowed_countries: ['TH'],
      },
      metadata: {
        userId,
        address: JSON.stringify(address)
      }
    });

    // บันทึก order
    const newOrder = new orderModel({
      userId,
      items,
      totalAmount: amount,
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
  try {
    const { sessionId } = req.body;
    const userId = req.client.id;
    
    // ตรวจสอบ session กับ Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      // อัพเดทสถานะการชำระเงินใน order
      const order = await orderModel.findOneAndUpdate(
        { sessionId },
        {
          paymentStatus: true,
          orderStatus: 'Processing'
        },
        { new: true }
      );

      if (!order) {
        throw new Error('Order not found');
      }

      // ล้างตะกร้าของ user
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      res.json({ 
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      // กรณีชำระเงินไม่สำเร็จ: เก็บ order ไว้และอัพเดทสถานะ
      await orderModel.findOneAndUpdate(
        { sessionId },
        {
          paymentStatus: false,
          orderStatus: 'Payment Failed',
          paymentFailedAt: new Date() // เพิ่มเวลาที่ชำระเงินไม่สำเร็จ
        }
      );
      
      res.json({ 
        success: false,
        message: 'Payment not completed'
      });
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
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { verifyStripe, placeOrderStripe, allOrders, userOrders, updateStatus };
