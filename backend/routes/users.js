import express from 'express';
import { registerUser, getUsers } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();


router.post('/', registerUser);
router.get('/', protect, admin, getUsers);

export default router;
