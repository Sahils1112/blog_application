import User from "../model/User.js";
import bcrypt from "bcryptjs";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(new ApiResponse(200, { users }));
  } catch {
    res.status(500).json(new ApiError(500, "Server error"));
  }
};

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json(new ApiError(400, "User exists"));
    }

    const user = new User({
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      blogs: []
    });

    await user.save();
    res.status(201).json(new ApiResponse(201, { user }));
  } catch {
    res.status(500).json(new ApiError(500, "Signup error"));
  }
};

export const logIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).json(new ApiError(400, "Invalid credentials"));
    }
    res.status(200).json(new ApiResponse(200, { user }));
  } catch {
    res.status(500).json(new ApiError(500, "Login error"));
  }
};
