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

const allowedOrigins = [
  process.env.FRONTEND_URI,
  process.env.FRONTEND_URI2,
  process.env.FRONTEND_URI3,
  "http://localhost:5173",
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error("Not allowed by CORS")); // Reject the request
    }
  },
  credentials: true, // Allow cookies or authorization headers
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));
app.use("/api/product", product);
app.use("/api/customer", customer);
app.use("/api/orders", order);
app.use("/api/cart", cart);
app.use("/api/payment", payment);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server strated at port: ${port}`);
});
