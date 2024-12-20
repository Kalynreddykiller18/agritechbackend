import express from "express";
import CustomerService from "../service/customer.js";
import authenticateJwt from "../middleware/authenticateJwt.js";

const router = express.Router();
const {
  getAllCusomers,
  getCustomerById,
  getDetailsByJWT,
  signup,
  addAddress,
  login,
  updateCustomerById,
  delCustomerById,
  forgottPassword,
  passwordValidation,
  updatePassword,
  deleteAdress,
  logout,
} = CustomerService;

router.get("/byjwt", authenticateJwt, getDetailsByJWT);
router.get("/", getAllCusomers);

router.get("/logout", authenticateJwt, logout);

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
