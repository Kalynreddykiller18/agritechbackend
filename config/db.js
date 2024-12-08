import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`DB Connceted to ${conn.Connection.name}`);
  } catch (err) {
    console.log("Errod in db connection: ", err.message);
  }
};

export default connectDB;
