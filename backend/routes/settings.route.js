import express from "express";
import {
  updateNotificationSettings,
  getNotificationSettings,
  updateSubscriptionPlan,
  getSubscriptionPlan,
  changeEmail,
  deleteAccount,
} from "../controllers/settings.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/notifications", protectRoute, getNotificationSettings);
router.put("/notifications", protectRoute, updateNotificationSettings);
router.get("/subscription", protectRoute, getSubscriptionPlan);
router.put("/subscription", protectRoute, updateSubscriptionPlan);
router.put("/change-email", protectRoute, changeEmail);
router.delete("/delete-account", protectRoute, deleteAccount);

export default router;
