import express from "express";
import product from "./controllers/product.js";
import customer from "./controllers/customer.js";
import order from "./controllers/order.js";
import cart from "./controllers/Cart.js";
import payment from "./controllers/Payment.js";
import connectDB from "./config/db.js";
import cors from "cors";
import connection from "./config/sqldb.js";

const app = express();

app.get("/hello", async (req, res, next) => {
  try {
    res.status(200).json({ message: "hello" });
  } catch (err) {
    console.log(err.message);
  }
});

connectDB();
const uri = process.env.FRONTEND_URI;
app.use(cors({ origin: uri }));

app.use(express.json({ limit: "50mb" }));
app.use("/api/product", product);
app.use("/api/customer", customer);
app.use("/api/orders", order);
app.use("/api/cart", cart);
app.use("/api/payment", payment);

const port = 3000;
app.listen(port, () => {
  console.log(`Server strated at port: ${port}`);
});
