import express from 'express';
import {
  getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement,
  getEvents, createEvent, updateEvent, deleteEvent,
  getPodcasts, createPodcast, deletePodcast,
  getBibleVerse, createBibleVerse, updateBibleVerse, getHomeData,
} from '../controllers/contentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();
router.get('/home', getHomeData);
router.get('/announcements', getAnnouncements);
router.get('/events', getEvents);
router.get('/podcasts', getPodcasts);
router.get('/bible-verse', getBibleVerse);
router.post('/announcements', protect, authorize('admin'), createAnnouncement);
router.put('/announcements/:id', protect, authorize('admin'), updateAnnouncement);
router.delete('/announcements/:id', protect, authorize('admin'), deleteAnnouncement);
router.post('/events', protect, authorize('admin'), createEvent);
router.put('/events/:id', protect, authorize('admin'), updateEvent);
router.delete('/events/:id', protect, authorize('admin'), deleteEvent);
router.post('/bible-verse', protect, authorize('admin'), createBibleVerse);
router.put('/bible-verse/:id', protect, authorize('admin'), updateBibleVerse);
router.post('/podcasts', protect, authorize('admin'), upload.single('thumbnail'), createPodcast);
router.delete('/podcasts/:id', protect, authorize('admin'), deletePodcast);
export default router;
