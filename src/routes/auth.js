import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user.modal.js";

const router = express.Router();
dotenv.config();

// LOGIN API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //  return res.json({message: "Login successful"});
    // Check fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    const passCompare = req.body.password === user.password;
    if (!passCompare) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      // { expiresIn: "1h" }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.cookie("userId", user._id.toString(), cookieOptions);
    res.cookie("userId", user._id.toString(), {
      ...cookieOptions,
      httpOnly: false, 
    });

    return res.json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email },
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
