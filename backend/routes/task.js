import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getMyTasks,
  uploadAttachment,
  addComment,
  deleteComment,
  markInProgress,
  markComplete,
  bulkCreateTasks,
  bulkDeleteTasks,
} from "../controllers/taskController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js"; // Multer config

const router = express.Router();

// Create task (auth required)
router.post("/", protect, createTask);

// Get all tasks (admin only)
router.get("/", protect, authorizeRoles("admin"), getTasks);

// Get logged-in user's tasks
router.get("/my", protect, getMyTasks);

// Get single task by ID
router.get("/:id", protect, getTaskById);

// Update task (creator or admin)
router.put("/:id", protect, updateTask);

// Delete task (creator or admin)
router.delete("/:id", protect, deleteTask);

// Upload attachment (uses Multer)
router.post("/:id/attachments", protect, upload.single("file"), uploadAttachment);

// Add comment
router.post("/:id/comments", protect, addComment);

// Delete comment
router.delete("/:taskId/comments/:commentId", protect, deleteComment);

// Mark task as in progress
router.patch("/:id/in-progress", protect, markInProgress);

// Mark task as completed
router.patch("/:id/complete", protect, markComplete);

// Bulk create tasks
router.post("/bulk-create", protect, bulkCreateTasks);

// Bulk delete tasks
router.delete("/bulk-delete", protect, bulkDeleteTasks);

export default router;
