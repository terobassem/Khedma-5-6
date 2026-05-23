import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { ApiError } from '../utils/ApiError.js';

export const registerUser = async (userData) => {
  const exists = await User.findOne({ email: userData.email });
  if (exists) throw new ApiError(400, 'البريد الإلكتروني مستخدم بالفعل');

  const user = await User.create(userData);
  const token = generateToken(user._id);
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    grade: user.grade,
    age: user.age,
    phone: user.phone,
    token,
  };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
  }
  const token = generateToken(user._id);
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    grade: user.grade,
    age: user.age,
    phone: user.phone,
    avatar: user.avatar,
    totalScore: user.totalScore,
    token,
  };
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw new ApiError(404, 'المستخدم غير موجود');
  return user;
};

export const updateUserProfile = async (userId, updates) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'المستخدم غير موجود');
  Object.assign(user, updates);
  await user.save();
  return User.findById(userId).select('-password');
};
