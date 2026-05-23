import * as authService from '../services/authService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json({ success: true, data: user });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUser(email, password);
  res.json({ success: true, data: user });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserProfile(req.user._id);
  res.json({ success: true, data: user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateUserProfile(req.user._id, req.body);
  res.json({ success: true, data: user });
});
