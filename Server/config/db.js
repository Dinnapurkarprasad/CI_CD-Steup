import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = mongoose.connect(`${process.env.MONGO_URL}`);
    console.log("Connected with db");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;
