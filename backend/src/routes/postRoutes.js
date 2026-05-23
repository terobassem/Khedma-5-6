import express from 'express';
import { getPosts, createPost, toggleLike, addComment, deletePost } from '../controllers/postController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();
router.get('/', getPosts);
router.post('/', protect, upload.single('media'), createPost);
router.put('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, addComment);
router.delete('/:id', protect, authorize('admin'), deletePost);
export default router;
