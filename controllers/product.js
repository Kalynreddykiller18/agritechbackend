import express from "express";
import ServiceProduct from "../service/product.js";

const router = express.Router();
const {
  getAllProducts,
  getProductById,
  addProduct,
  updateProductById,
  delProdById,
  delAllProducts,
} = ServiceProduct;

router.post("/", addProduct);

router.get("/:id", getProductById);

router.get("/", getAllProducts);

router.put("/:id", updateProductById);

router.delete("/many", delAllProducts);
router.delete("/:id", delProdById);

export default router;
