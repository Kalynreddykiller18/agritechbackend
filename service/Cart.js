import Cart from "../models/Cart.js";

const getCartItemsbyCustomer = async (req, res, next) => {
  try {
    const data = await Cart.find({ customer_id: req.params.id });
    if (!data)
      return res
        .status(404)
        .json({ message: "Customer doesnot have Cart items added" });

    res.status(200).json(data);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

const addCartItem = async (req, res, next) => {
  try {
    const item = await Cart.findOneAndUpdate(
      {
        product_id: req.body.product_id,
        customer_id: req.body.customer_id,
      },
      { $inc: { count: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(item);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

const removeItem = async (req, res, next) => {
  try {
    const item = await Cart.findOneAndUpdate(
      {
        product_id: req.body.product_id,
        customer_id: req.body.customer_id,
      },
      { $inc: { count: -1 } },
      {
        new: true,
      }
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.count <= 0) {
      await Cart.deleteOne({
        product_id: req.body.product_id,
        customer_id: req.body.customer_id,
      });

      return res.status(200).json({ message: "Item deleted" });
    }

    res.status(200).json(item);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

const emptyCart = async (req, res, next) => {
  try {
    const data = await Cart.deleteMany({ customer_id: req.params.id });
    res.status(200).json({ message: "Cart emptied" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

const cart = { getCartItemsbyCustomer, addCartItem, removeItem, emptyCart };

export default cart;
