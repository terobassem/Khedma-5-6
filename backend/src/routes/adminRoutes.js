import express from 'express';
import { getAnalytics, getUsers, deleteUser } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect, authorize('admin'));
router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
export default router;
