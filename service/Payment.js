import Razorpay from "razorpay";
import crypto from "crypto";
import order from "./order.js";

const { createOrderwithPayment } = order;

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.PAYMENT_ID,
  key_secret: process.env.PAYMENT_SECRET,
});

// Backend Endpoint to Create an Order
const createPayment = async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const options = {
      amount: amount * 100, // Convert to smallest currency unit (e.g., paise for INR)
      currency: currency || "INR",
      receipt: "order_rcptid_11", // Optional
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ orderId: order.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" });
  }
};

const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    cart,
    checkout_address,
  } = req.body;

  const secret = process.env.PAYMENT_SECRET; // Razorpay Key Secret
  const hash = crypto
    .createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (hash === razorpay_signature) {
    cart.forEach((item) => {
      const order = {
        order_id: razorpay_order_id,
        product_id: item.product_id,
        customer_id: item.customer_id,
        quantity: item.count,
        address: checkout_address,
        status: "Confirmed",
        payment_id: razorpay_payment_id,
      };
      createOrderwithPayment(order);
    });
    res.status(200).json({ success: true, message: "Payment verified" });
  } else {
    res
      .status(400)
      .json({ success: false, message: "Invalid payment signature" });
  }
};

const Payment = { createPayment, verifyPayment };

export default Payment;
