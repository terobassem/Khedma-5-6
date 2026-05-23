import * as postService from '../services/postService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getFileUrl } from '../middleware/uploadMiddleware.js';

export const getPosts = asyncHandler(async (req, res) => {
  const posts = await postService.getPosts();
  res.json({ success: true, data: posts });
});

export const createPost = asyncHandler(async (req, res) => {
  const media = getFileUrl(req.file, req);
  const mediaType = req.file?.mimetype?.startsWith('video/') ? 'video' : 'image';
  const post = await postService.createPost({
    media,
    mediaType,
    caption: req.body.caption || '',
    createdBy: req.user._id,
  });
  const populated = await post.populate('createdBy', 'name avatar grade');
  res.status(201).json({ success: true, data: populated });
});

export const toggleLike = asyncHandler(async (req, res) => {
  const post = await postService.toggleLike(req.params.id, req.user._id);
  res.json({ success: true, data: post });
});

export const addComment = asyncHandler(async (req, res) => {
  const post = await postService.addComment(req.params.id, req.user._id, req.body.text);
  res.json({ success: true, data: post });
});

export const deletePost = asyncHandler(async (req, res) => {
  await postService.deletePost(req.params.id);
  res.json({ success: true, message: 'تم حذف المنشور' });
});
