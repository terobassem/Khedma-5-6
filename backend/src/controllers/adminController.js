import * as adminService from '../services/adminService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await adminService.getAnalytics();
  res.json({ success: true, data: analytics });
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await adminService.getAllUsers();
  res.json({ success: true, data: users });
});

export const deleteUser = asyncHandler(async (req, res) => {
  await adminService.deleteUser(req.params.id);
  res.json({ success: true, message: 'تم حذف المستخدم' });
});
