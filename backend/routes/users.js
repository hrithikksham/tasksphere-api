import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  getMe,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/", protect, admin, getUsers);
router.get("/me", protect, getMe);

export default router;
