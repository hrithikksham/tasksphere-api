import express from "express";
import { createTask, getTasks } from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", protect, createTask);
router.get("/", protect, getTasks);

export default router;
