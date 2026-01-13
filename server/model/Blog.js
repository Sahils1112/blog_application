import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  img: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Blog", blogSchema);
