import User from '../models/User.js';
import Quiz from '../models/Quiz.js';
import Post from '../models/Post.js';
import Result from '../models/Result.js';
import { ApiError } from '../utils/ApiError.js';

export const getAnalytics = async () => {
  const [totalUsers, totalQuizzes, totalPosts, topStudents, recentResults] = await Promise.all([
    User.countDocuments(),
    Quiz.countDocuments(),
    Post.countDocuments(),
    User.find({ role: 'student' })
      .select('name grade totalScore quizzesTaken')
      .sort('-totalScore')
      .limit(5),
    Result.find()
      .populate('student', 'name grade')
      .populate('quiz', 'title')
      .sort('-createdAt')
      .limit(10),
  ]);

  return { totalUsers, totalQuizzes, totalPosts, topStudents, recentResults };
};

export const getAllUsers = async () => {
  return User.find().select('-password').sort('-createdAt');
};

export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new ApiError(404, 'المستخدم غير موجود');
  await Result.deleteMany({ student: id });
  await Post.deleteMany({ createdBy: id });
  return user;
};
