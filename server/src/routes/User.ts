import express, { Request, Response } from "express";
import { User } from "../models/User";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Update user profile endpoint
router.patch("/:id", authenticateToken, async (req: any, res: Response) => {
  const { id } = req.params;
  const { name, context, bio, photo } = req.body;

  // Verify user is updating their own profile
  if (req.user.id !== id) {
    return res.status(403).json({ message: "You can only update your own profile" });
  }

  try {
    const updateData: any = {};
    if (name) updateData.name = name;
    if (context) updateData.context = context;
    if (bio !== undefined) updateData.bio = bio; // Allow empty string
    if (photo !== undefined) updateData.photo = photo; // Allow empty string

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
});

export default router;
