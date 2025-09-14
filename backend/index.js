import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

// Swagger
import { swaggerSpec, swaggerUi } from "./config/swagger.js";

// Database
import connectDB from "./config/db.js";

// Middleware
import logger from "./middleware/logger.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Routes
import healthRoutes from "./routes/health.js";
import userRoutes from "./routes/users.js";
import taskRoutes from "./routes/task.js";
import dashboardRoutes from "./routes/dashboard.js";
import notificationRoutes from "./routes/notifications.js";
import logRoutes from "./routes/log.js";

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// -------------------- Middleware --------------------
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(helmet()); // Secure HTTP headers

// Rate limit login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 attempts
  message: { message: "Too many login attempts, try again later" },
});

// -------------------- Swagger UI --------------------
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// -------------------- Routes --------------------
app.get("/", (req, res) => res.send("🚀 Tasksphere API is running"));

app.use("/api/users/login", loginLimiter);
app.use("/api/health", healthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/logs", logRoutes);

// -------------------- Error Handling --------------------
app.use(notFound);    // 404 handler
app.use(errorHandler); // General error handler

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `🚀 Tasksphere API running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`
  );
});
