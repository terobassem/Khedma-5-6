import * as quizService from '../services/quizService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createQuiz = asyncHandler(async (req, res) => {
  const quiz = await quizService.createQuiz(req.body, req.user._id);
  res.status(201).json({ success: true, data: quiz });
});

export const getQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await quizService.getQuizzes(req.query);
  res.json({ success: true, data: quizzes });
});

export const getQuiz = asyncHandler(async (req, res) => {
  const includeAnswers = req.user.role === 'admin';
  const quiz = await quizService.getQuizById(req.params.id, includeAnswers);
  res.json({ success: true, data: quiz });
});

export const submitQuiz = asyncHandler(async (req, res) => {
  const result = await quizService.submitQuiz(req.params.id, req.user._id, req.body.answers);
  res.status(201).json({ success: true, data: result });
});

export const getResults = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'student' ? { student: req.user._id } : {};
  const results = await quizService.getResults(filter);
  res.json({ success: true, data: results });
});

export const getLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await quizService.getLeaderboard(parseInt(req.query.limit) || 10);
  res.json({ success: true, data: leaderboard });
});

export const deleteQuiz = asyncHandler(async (req, res) => {
  await quizService.deleteQuiz(req.params.id);
  res.json({ success: true, message: 'تم حذف الاختبار' });
});
