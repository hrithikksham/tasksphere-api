import express from "express";
import { getLogs } from "../controllers/logController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, admin, getLogs);

export default router;
