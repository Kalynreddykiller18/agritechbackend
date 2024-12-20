import Customer from "../models/customer.js";
import Token from "../models/token.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const getAllCusomers = async (req, res, next) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({ id: parseInt(req.params.id) });
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    const data = {
      id: customer.id,
      firstname: customer.firstname,
      lastname: customer.lastname,
      email: customer.email,
      mobile: customer.mobile,
      adress: customer?.adress,
      enable: customer?.enable,
    };
    res.status(200).json({ customer: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDetailsByJWT = async (req, res, next) => {
  try {
    const idn = req.user.id;
    const customer = await Customer.findOne({ id: idn });
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    const data = {
      id: customer.id,
      firstname: customer.firstname,
      lastname: customer.lastname,
      email: customer.email,
      mobile: customer.mobile,
      adress: customer?.adress,
      enable: customer?.enable,
    };
    res.status(200).json(data);
  } catch (err) {
    console.log("Error in jwt", err.message);
  }
};

const signup = async (req, res) => {
  try {
    const checkcust = await Customer.findOne({ email: req.body.email });

    if (checkcust) {
      return res.status(200).json({ message: "User already exist" });
    }
    const saltrounds = 10;
    const hashedpass = await bcrypt.hash(req.body.password, saltrounds);

    var prod = null;
    var random = 0;
    var count = 0;
    do {
      random = Math.floor(Math.random() * 10000000);
      let cust = await Customer.findOne({ id: random });

      console.log("Prod: ", cust?.name);
      console.log("Null: ", count, " Random: ", random);
      count++;
    } while (prod != null);

    console.log("id:", random);

    const newCustomer = {
      id: random,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      mobile: req.body.mobile,
      password: hashedpass,
    };

    await Customer.create(newCustomer);
    res.status(201).json({ message: "Customer signedup successfully" });
    console.log("Updated");
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err.message);
  }
};

const login = async (req, res) => {
  try {
    const customer = await Customer.findOne({ email: req.body.email });
    if (!customer) {
      return res.status(404).json({ message: "User not Found" });
    }

    const isValid = await bcrypt.compare(req.body.password, customer.password);

    const newcust = {
      id: customer.id,
      firstname: customer.firstname,
      lastname: customer.lastname,
      email: customer.email,
      mobile: customer.mobile,
      adress: customer?.adress,
      enable: customer?.enable,
    };

    if (isValid) {
      ///////////////////////////// JsonWebToken /////////////////////
      const SECRET_KEY = process.env.SECRET_KEY;
      const token = jwt.sign(
        { id: newcust.id, username: newcust.firstname, role: "user" },
        SECRET_KEY,
        { expiresIn: "1hr" }
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 3600000,
      });

      return res.status(200).json({ message: "Login successful", newcust });
    }

    res.status(401).json({ message: "Invalid credentials" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err.message);
  }
};

const forgottPassword = async (req, res, next) => {
  try {
    const user = await Customer.findOne({ email: req.body.mail });
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    const newTokenString = `${Math.floor(Math.random() * 1000000)}${
      user.firstname
    }`;

    const saltCount = 10;
    let hashedToken = await bcrypt.hash(newTokenString, saltCount);
    while (hashedToken.includes("/")) {
      hashedToken = await bcrypt.hash(newTokenString, saltCount);
    }

    const token = await Token.create({
      id: user._id,
      mail: user.email,
      token: hashedToken,
    });

    console.log("Token saved", token.id);

    const mailTransporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.USER,
      to: req.body.mail,
      subject: `Reset Password - Login DEMO`,
      text: `Hi ${user.firstname}, \n
      Please use below link to reser your password, this link will expire in 20 minutes. \n
      ${process.env.FRONTEND_URI}/resetpassword/${encodeURIComponent(
        hashedToken
      )}`,
    };

    console.log(mailOptions);

    const info = await mailTransporter.sendMail(mailOptions);

    console.log("Mail sent", info);

    res.status(200).json({ token: newTokenString });
  } catch (err) {
    next(err);
  }
};

const passwordValidation = async (req, res, next) => {
  try {
    const token = decodeURIComponent(req.params.token);
    const tokenData = await Token.findOne({ token });

    const curTime = Date.now() - tokenData.createdAt;
    if (curTime < 1200000) {
      console.log("Valid request");
      return res.status(200).json({ message: "Valid Url" });
    } else {
      return res.status(401).json({ message: "Token expired" });
    }
  } catch (err) {
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const token = decodeURIComponent(req.headers.token);
    console.log("headers token: ", token);
    const tokenUser = await Token.findOne({ token });
    console.log(tokenUser);

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const userPassUpdate = await Customer.findOneAndUpdate(
      {
        email: tokenUser.mail,
      },
      { password: hashedPassword }
    );

    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    next(err);
  }
};

const updateCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!customer) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json({ message: "Product details updated" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

const delCustomerById = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteuser = await Customer.findOneAndDelete({ id: id });
    if (deleteuser == null) {
      res.status(404).json({ message: "Customer not found" });
    } else {
      res.status(200).json({ message: `Customer deleted with id: ${id}` });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ err: err.message });
  }
};

const addAddress = async (req, res, next) => {
  try {
    const id = req.params.id;
    const newAddress = {
      name: req.body.name,
      line1: req.body.line1,
      line2: req.body.line2,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      mobile: req.body.mobile,
    };
    const dataadd = await Customer.findOneAndUpdate(
      { id: id },
      { $push: { adress: newAddress } },
      { new: true }
    );

    if (!dataadd) {
      console.log("True");
    }

    res.status(200).json({ message: "Adress added", dataadd });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

const deleteAdress = async (req, res, next) => {
  try {
    const { id, index } = req.params;
    const customer = await Customer.findOneAndUpdate(
      {
        id: id,
      },
      {
        $unset: {
          [`adress.${index}`]: 1,
        },
      },
      {
        new: true,
      }
    );

    customer.adress = customer.adress.filter((address) => address);
    await customer.save();

    res.status(200).json({ message: "Address deleted", customer });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

const customer = {
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
};

export default customer;
