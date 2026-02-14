import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
} from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/", getUserProfile);
router.put("/update", updateUserProfile);
router.put("/change-password", changePassword);
router.get("/watchlist", getWatchlist);
router.post("/watchlist/add", addToWatchlist);
router.post("/watchlist/remove", removeFromWatchlist);

export default router;
