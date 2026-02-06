import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";

// Update notification settings
export async function updateNotificationSettings(req, res) {
  try {
    const userId = req.user.id;
    const { emailNotifications, newReleases, promotions } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (emailNotifications !== undefined) {
      user.notificationSettings.emailNotifications = emailNotifications;
    }
    if (newReleases !== undefined) {
      user.notificationSettings.newReleases = newReleases;
    }
    if (promotions !== undefined) {
      user.notificationSettings.promotions = promotions;
    }

    user.updatedAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Notification settings updated",
      notificationSettings: user.notificationSettings,
    });
  } catch (error) {
    console.log(
      "Error in updateNotificationSettings controller",
      error.message,
    );
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Get notification settings
export async function getNotificationSettings(req, res) {
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
      notificationSettings: user.notificationSettings,
    });
  } catch (error) {
    console.log("Error in getNotificationSettings controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Update subscription plan
export async function updateSubscriptionPlan(req, res) {
  try {
    const userId = req.user.id;
    const { plan } = req.body;

    if (!plan) {
      return res
        .status(400)
        .json({ success: false, message: "Plan is required" });
    }

    const validPlans = ["free", "basic", "standard", "premium"];
    if (!validPlans.includes(plan)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid subscription plan" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.subscriptionPlan = plan;
    user.updatedAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: `Subscription updated to ${plan}`,
      subscriptionPlan: user.subscriptionPlan,
    });
  } catch (error) {
    console.log("Error in updateSubscriptionPlan controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Get subscription plan
export async function getSubscriptionPlan(req, res) {
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
      subscriptionPlan: user.subscriptionPlan,
    });
  } catch (error) {
    console.log("Error in getSubscriptionPlan controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Change email
export async function changeEmail(req, res) {
  try {
    const userId = req.user.id;
    const { newEmail, password } = req.body;

    if (!newEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "New email and password are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Verify password
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    user.email = newEmail;
    user.updatedAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email changed successfully",
      email: user.email,
    });
  } catch (error) {
    console.log("Error in changeEmail controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Delete account
export async function deleteAccount(req, res) {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Verify password
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    await User.findByIdAndDelete(userId);

    // Clear the auth cookie
    res.clearCookie("jwt-auth");

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleteAccount controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
