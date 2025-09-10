import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  getMe,
  updateProfile,
  uploadAvatar,
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

// Update profile
router.put("/update-profile", protect, updateProfile);

// Upload avatar
router.post("/upload-avatar", protect, upload.single("avatar"), uploadAvatar);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


export default router;
