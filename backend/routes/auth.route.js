import express from "express";

import {
  login,
  signup,
  logout,
  authCheck,
  deleteAccount,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/authCheck", protectRoute, authCheck);
router.post("/signup", signup);
router.post("/login", login);

router.delete("/deleteAccount", protectRoute, deleteAccount);

export default router;
