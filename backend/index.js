import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import logger from './middleware/logger.js';
import healthRoutes from './routes/health.js';

dotenv.config();
connectDB();


const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

// --- Routes ---
app.use('/api/health', healthRoutes);
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Tasksphere API is running on ${PORT}`);
});