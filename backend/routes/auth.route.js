import express from "express";

import {
  login,
  signup,
  logout,
  authCheck,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/authCheck", authCheck);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
