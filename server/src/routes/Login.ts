import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { User } from "../models/User";
import { verifyGoogleToken } from "../utils/verifyGoogleToken";

import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

router.post("/common", async (req: Request, res: any): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password!))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString());

    // Send HTTP-only cookie
    return res
      .cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({ message: "Login successful", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

// Google Login
router.post("/google", async (req: Request, res: any): Promise<void> => {
  const { credential: idToken } = req.body;

  try {
    const payload = await verifyGoogleToken(idToken);

    if (!payload) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    const { sub: googleId, email, name } = payload;

    let user = await User.findOne({ googleId });

    if (!user) {
      // For Google users, we'll require them to complete their profile later
      // For now, use email as context placeholder
      user = new User({
        googleId,
        email,
        name: name || email.split('@')[0],
        context: '' // Will be filled in profile completion
      });
      await user.save();
    }

    const token = generateToken(user._id.toString());

    return res
      .cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "Login successful", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Authentication failed", error: error.message });
  }
});

router.post("/logout", (req, res: any) => {
  return res
    .clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .json({ message: "Logged out successfully" });
});

export default router;
