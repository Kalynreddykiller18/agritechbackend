import mongoose from "mongoose";

const customerSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  adress: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        line1: {
          type: String,
          required: true,
        },
        line2: {
          type: String,
        },
        city: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        pincode: {
          type: Number,
          required: true,
        },
        mobile: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  enable: {
    type: Boolean,
  },
});

const customer = mongoose.model("Customer", customerSchema);

export default customer;
