import express from "express";
import order from "../service/order.js";

const router = express.Router();

const {
  getOrders,
  getOrderByID,
  createOrder,
  getOrdersbyCustomerId,
  updateOrderById,
  deleteOrder,
} = order;

router.get("/", getOrders);
router.get("/:id", getOrderByID);
router.get("/bycustid/:id", getOrdersbyCustomerId);
router.post("/", createOrder);
router.put("/:id", updateOrderById);
router.delete("/:id", deleteOrder);

export default router;
