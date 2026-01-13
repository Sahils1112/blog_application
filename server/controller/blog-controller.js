import mongoose from "mongoose";
import Blog from "../model/Blog.js";
import User from "../model/User.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    if (!blogs.length) {
      return res.status(404).json(new ApiError(404, "No blogs found"));
    }
    res.status(200).json(new ApiResponse(200, { blogs }));
  } catch (e) {
    res.status(500).json(new ApiError(500, e.message));
  }
};

export const addBlog = async (req, res) => {
  const { title, desc, img, user } = req.body;

  try {
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(400).json(new ApiError(400, "Unauthorized"));
    }

    const blog = new Blog({ title, desc, img, user });

    const session = await mongoose.startSession();
    session.startTransaction();

    await blog.save({ session });
    existingUser.blogs.push(blog);
    await existingUser.save({ session });

    await session.commitTransaction();

    res.status(201).json(new ApiResponse(201, { blog }));
  } catch (e) {
    res.status(500).json(new ApiError(500, e.message));
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(new ApiResponse(200, { blog }));
  } catch (e) {
    res.status(500).json(new ApiError(500, e.message));
  }
};

export const getById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.status(200).json(new ApiResponse(200, { blog }));
  } catch (e) {
    res.status(500).json(new ApiError(500, e.message));
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id).populate("user");
    blog.user.blogs.pull(blog);
    await blog.user.save();
    res.status(200).json(new ApiResponse(200, null, "Deleted"));
  } catch (e) {
    res.status(500).json(new ApiError(500, e.message));
  }
};

export const getByUserId = async (req, res) => {
  try {
    const userBlogs = await User.findById(req.params.id).populate("blogs");
    res.status(200).json(new ApiResponse(200, { userBlogs }));
  } catch (e) {
    res.status(500).json(new ApiError(500, e.message));
  }
};
