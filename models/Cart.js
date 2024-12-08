import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
  product_id: {
    type: Number,
    required: true,
  },
  customer_id: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  count: {
    type: Number,
    default: 1,
    required: true,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
