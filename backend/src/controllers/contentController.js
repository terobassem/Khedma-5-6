import Announcement from '../models/Announcement.js';
import Event from '../models/Event.js';
import Podcast from '../models/Podcast.js';
import BibleVerse from '../models/BibleVerse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { getFileUrl } from '../middleware/uploadMiddleware.js';
import * as quizService from '../services/quizService.js';

export const getAnnouncements = asyncHandler(async (req, res) => {
  const data = await Announcement.find().sort('-createdAt').limit(10);
  res.json({ success: true, data });
});

export const createAnnouncement = asyncHandler(async (req, res) => {
  const data = await Announcement.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, data });
});

export const updateAnnouncement = asyncHandler(async (req, res) => {
  const data = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!data) throw new ApiError(404, 'الإعلان غير موجود');
  res.json({ success: true, data });
});

export const deleteAnnouncement = asyncHandler(async (req, res) => {
  const data = await Announcement.findByIdAndDelete(req.params.id);
  if (!data) throw new ApiError(404, 'الإعلان غير موجود');
  res.json({ success: true, message: 'تم الحذف' });
});

export const getEvents = asyncHandler(async (req, res) => {
  const data = await Event.find({ date: { $gte: new Date() } }).sort('date').limit(10);
  res.json({ success: true, data });
});

export const createEvent = asyncHandler(async (req, res) => {
  const data = await Event.create(req.body);
  res.status(201).json({ success: true, data });
});

export const updateEvent = asyncHandler(async (req, res) => {
  const data = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!data) throw new ApiError(404, 'الفعالية غير موجودة');
  res.json({ success: true, data });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const data = await Event.findByIdAndDelete(req.params.id);
  if (!data) throw new ApiError(404, 'الفعالية غير موجودة');
  res.json({ success: true, message: 'تم الحذف' });
});

export const getPodcasts = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const data = await Podcast.find(filter).populate('createdBy', 'name').sort('-createdAt');
  res.json({ success: true, data });
});

export const createPodcast = asyncHandler(async (req, res) => {
  const thumbnail = req.file ? getFileUrl(req.file, req) : req.body.thumbnail || '';
  const data = await Podcast.create({
    title: req.body.title,
    description: req.body.description,
    videoUrl: req.body.videoUrl,
    category: req.body.category || 'عام',
    thumbnail,
    createdBy: req.user._id,
  });
  res.status(201).json({ success: true, data });
});

export const deletePodcast = asyncHandler(async (req, res) => {
  const podcast = await Podcast.findByIdAndDelete(req.params.id);
  if (!podcast) throw new ApiError(404, 'الفيديو غير موجود');
  res.json({ success: true, message: 'تم الحذف' });
});

export const getBibleVerse = asyncHandler(async (req, res) => {
  const verse = await BibleVerse.findOne({ isActive: true }).sort('-createdAt');
  res.json({ success: true, data: verse });
});

export const createBibleVerse = asyncHandler(async (req, res) => {
  await BibleVerse.updateMany({}, { isActive: false });
  const data = await BibleVerse.create({ ...req.body, isActive: true });
  res.status(201).json({ success: true, data });
});

export const updateBibleVerse = asyncHandler(async (req, res) => {
  const data = await BibleVerse.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!data) throw new ApiError(404, 'الآية غير موجودة');
  res.json({ success: true, data });
});

export const getHomeData = asyncHandler(async (req, res) => {
  const [announcements, podcasts, events, leaderboard, bibleVerse] = await Promise.all([
    Announcement.find().sort('-createdAt').limit(3),
    Podcast.find().populate('createdBy', 'name').sort('-createdAt').limit(4),
    Event.find({ date: { $gte: new Date() } }).sort('date').limit(4),
    quizService.getLeaderboard(5),
    BibleVerse.findOne({ isActive: true }).sort('-createdAt'),
  ]);
  res.json({ success: true, data: { announcements, podcasts, events, leaderboard, bibleVerse } });
});
