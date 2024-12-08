import cart from "../service/Cart.js";
import express from "express";

const router = express.Router();

const { getCartItemsbyCustomer, addCartItem, removeItem, emptyCart } = cart;

router.get("/:id", getCartItemsbyCustomer);
router.post("/add", addCartItem);
router.post("/remove", removeItem);
router.get("/empty/:id", emptyCart);

export default router;
