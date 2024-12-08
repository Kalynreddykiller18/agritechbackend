import express from "express";
import Payment from "../service/Payment.js";

const { createPayment, verifyPayment } = Payment;

const router = express.Router();

router.post("/create-order", createPayment);
router.post("/verify-payment", verifyPayment);

export default router;
