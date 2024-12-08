import express from "express";
import CustomerService from "../service/customer.js";

const router = express.Router();
const {
  getAllCusomers,
  getCustomerById,
  signup,
  addAddress,
  login,
  updateCustomerById,
  delCustomerById,
  forgottPassword,
  passwordValidation,
  updatePassword,
  deleteAdress,
} = CustomerService;

router.get("/", getAllCusomers);

router.get("/:id", getCustomerById);

router.post("/", signup);

router.post("/addaddress/:id", addAddress);
router.get("/deleteaddress/:id/:index", deleteAdress);

router.post("/login", login);

router.put("/:id", updateCustomerById);

router.delete("/:id", delCustomerById);

router.post("/forgotpassword", forgottPassword);

router.get("/resetpasswordvalidation/:token", passwordValidation);

router.post("/changepassword", updatePassword);

export default router;
