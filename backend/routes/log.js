import express from "express";
import { getLogs } from "../controllers/logController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), getLogs);

export default router;
