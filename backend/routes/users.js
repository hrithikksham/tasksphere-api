import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  getMe,
} from "../controllers/userController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// register User
router.post("/", registerUser);

// Login User
router.post("/login", loginUser);

// Get users ( admin only )
router.get("/", protect, authorizeRoles("admin"), getUsers);

// Get me ( need auth )
router.get("/me", protect, getMe);



export default router;
