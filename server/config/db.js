import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Blog"
    );
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
