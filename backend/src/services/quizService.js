import Quiz from '../models/Quiz.js';
import Result from '../models/Result.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

export const createQuiz = async (data, adminId) => {
  return Quiz.create({ ...data, createdBy: adminId });
};

export const getQuizzes = async (filters = {}) => {
  const query = { isActive: true, ...filters };
  return Quiz.find(query).populate('createdBy', 'name').sort('-createdAt');
};

export const getQuizById = async (id, includeAnswers = false) => {
  const quiz = await Quiz.findById(id).populate('createdBy', 'name');
  if (!quiz) throw new ApiError(404, 'الاختبار غير موجود');

  if (!includeAnswers) {
    const sanitized = quiz.toObject();
    sanitized.questions = sanitized.questions.map((q) => {
      const { correctAnswer, ...rest } = q;
      return rest;
    });
    return sanitized;
  }
  return quiz;
};

export const submitQuiz = async (quizId, studentId, answers) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new ApiError(404, 'الاختبار غير موجود');

  const existing = await Result.findOne({ student: studentId, quiz: quizId });
  if (existing) throw new ApiError(400, 'لقد أجريت هذا الاختبار مسبقاً');

  let score = 0;
  const gradedAnswers = answers.map((ans) => {
    const question = quiz.questions.id(ans.questionId);
    const isCorrect = question && question.correctAnswer === ans.selectedAnswer;
    if (isCorrect) score++;
    return {
      questionId: ans.questionId,
      selectedAnswer: ans.selectedAnswer,
      isCorrect,
    };
  });

  const totalQuestions = quiz.questions.length;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const result = await Result.create({
    student: studentId,
    quiz: quizId,
    answers: gradedAnswers,
    score,
    totalQuestions,
    percentage,
  });

  await User.findByIdAndUpdate(studentId, {
    $inc: { totalScore: score, quizzesTaken: 1 },
  });

  return result.populate([
    { path: 'student', select: 'name grade' },
    { path: 'quiz', select: 'title' },
  ]);
};

export const getResults = async (filters = {}) => {
  return Result.find(filters)
    .populate('student', 'name grade age')
    .populate('quiz', 'title')
    .sort('-createdAt');
};

export const getLeaderboard = async (limit = 10) => {
  return User.find({ role: 'student' })
    .select('name grade age totalScore quizzesTaken avatar')
    .sort('-totalScore')
    .limit(limit);
};

export const deleteQuiz = async (id) => {
  const quiz = await Quiz.findByIdAndDelete(id);
  if (!quiz) throw new ApiError(404, 'الاختبار غير موجود');
  await Result.deleteMany({ quiz: id });
  return quiz;
};
