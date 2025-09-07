import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import logger from "./middleware/logger.js";
import healthRoutes from "./routes/health.js";
import userRoutes from "./routes/users.js";
import taskRoutes from "./routes/task.js";
import dashboardRoutes from "./routes/dashboard.js";
import notificationRoutes from "./routes/notifications.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes); 


// 404 Handler
app.use(notFound);

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`🚀 Tasksphere API running in ${process.env.NODE_ENV}  on http://localhost:${PORT}`);
});