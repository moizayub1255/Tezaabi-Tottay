import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";

// Get user profile
export async function getUserProfile(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        phone: user.phone,
        country: user.country,
        image: user.image,
        subscriptionPlan: user.subscriptionPlan,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("Error in getUserProfile controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Update user profile
export async function updateUserProfile(req, res) {
  try {
    const userId = req.user.id;
    const { firstName, lastName, bio, phone, country, image } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (bio) user.bio = bio;
    if (phone) user.phone = phone;
    if (country) user.country = country;
    if (image) user.image = image;
    user.updatedAt = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        phone: user.phone,
        country: user.country,
        image: user.image,
        subscriptionPlan: user.subscriptionPlan,
      },
    });
  } catch (error) {
    console.log("Error in updateUserProfile controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Change password
export async function changePassword(req, res) {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordCorrect = await bcryptjs.compare(
      oldPassword,
      user.password,
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    user.password = hashedPassword;
    user.updatedAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("Error in changePassword controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Add to watchlist
export async function addToWatchlist(req, res) {
  try {
    const userId = req.user.id;
    const { contentId, title, posterPath, contentType } = req.body;

    if (!contentId || !title || !posterPath || !contentType) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if already in watchlist
    const exists = user.watchlist.some((item) => item.contentId === contentId);

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Already in watchlist",
      });
    }

    user.watchlist.push({
      contentId,
      title,
      posterPath,
      contentType,
      addedAt: new Date(),
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Added to watchlist",
      watchlist: user.watchlist,
    });
  } catch (error) {
    console.log("Error in addToWatchlist controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Remove from watchlist
export async function removeFromWatchlist(req, res) {
  try {
    const userId = req.user.id;
    const { contentId } = req.body;

    if (!contentId) {
      return res
        .status(400)
        .json({ success: false, message: "Content ID is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.watchlist = user.watchlist.filter(
      (item) => item.contentId !== contentId,
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Removed from watchlist",
      watchlist: user.watchlist,
    });
  } catch (error) {
    console.log("Error in removeFromWatchlist controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Get watchlist
export async function getWatchlist(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      watchlist: user.watchlist,
    });
  } catch (error) {
    console.log("Error in getWatchlist controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
