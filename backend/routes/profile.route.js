import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
} from "../controllers/profile.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getUserProfile);
router.put("/update", protectRoute, updateUserProfile);
router.put("/change-password", protectRoute, changePassword);
router.get("/watchlist", protectRoute, getWatchlist);
router.post("/watchlist/add", protectRoute, addToWatchlist);
router.post("/watchlist/remove", protectRoute, removeFromWatchlist);

export default router;
