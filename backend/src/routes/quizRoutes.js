import express from 'express';
import {
  createQuiz, getQuizzes, getQuiz, submitQuiz, getResults, getLeaderboard, deleteQuiz,
} from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/leaderboard', getLeaderboard);
router.get('/', protect, getQuizzes);
router.get('/results', protect, getResults);
router.get('/:id', protect, getQuiz);
router.post('/:id/submit', protect, authorize('student'), submitQuiz);
router.post('/', protect, authorize('admin'), createQuiz);
router.delete('/:id', protect, authorize('admin'), deleteQuiz);
export default router;
