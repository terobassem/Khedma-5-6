import Post from '../models/Post.js';
import { ApiError } from '../utils/ApiError.js';

export const getPosts = async () => {
  return Post.find()
    .populate('createdBy', 'name avatar grade')
    .populate('comments.user', 'name avatar')
    .sort('-createdAt');
};

export const createPost = async (data) => Post.create(data);

export const toggleLike = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, 'المنشور غير موجود');

  const index = post.likes.indexOf(userId);
  if (index > -1) post.likes.splice(index, 1);
  else post.likes.push(userId);

  await post.save();
  return post.populate('createdBy', 'name avatar grade');
};

export const addComment = async (postId, userId, text) => {
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, 'المنشور غير موجود');

  post.comments.push({ user: userId, text });
  await post.save();
  return post.populate([
    { path: 'createdBy', select: 'name avatar grade' },
    { path: 'comments.user', select: 'name avatar' },
  ]);
};

export const deletePost = async (id) => {
  const post = await Post.findByIdAndDelete(id);
  if (!post) throw new ApiError(404, 'المنشور غير موجود');
  return post;
};
