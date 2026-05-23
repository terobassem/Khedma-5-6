import { useEffect, useState } from 'react';
import { FaHeart, FaComment, FaImage, FaTrash } from 'react-icons/fa';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [commentText, setCommentText] = useState({});
  const { user, isAdmin } = useAuth();

  const fetchPosts = () => {
    postAPI.getAll().then((res) => setPosts(res.data.data)).catch(() => toast.error('فشل التحميل')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('اختر صورة أو فيديو');
    const fd = new FormData();
    fd.append('media', file);
    fd.append('caption', caption);
    try {
      await postAPI.create(fd);
      toast.success('تم النشر!');
      setCaption(''); setFile(null);
      fetchPosts();
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'فشل الرفع');
    }
  };

  const handleLike = async (id) => {
    try {
      const res = await postAPI.like(id);
      setPosts(posts.map((p) => (p._id === id ? res.data.data : p)));
    } catch { toast.error('فشل'); }
  };

  const handleComment = async (id) => {
    const text = commentText[id];
    if (!text?.trim()) return;
    try {
      const res = await postAPI.comment(id, text);
      setPosts(posts.map((p) => (p._id === id ? res.data.data : p)));
      setCommentText({ ...commentText, [id]: '' });
    } catch { toast.error('فشل'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('حذف هذا المنشور؟')) return;
    await postAPI.delete(id);
    setPosts(posts.filter((p) => p._id !== id));
    toast.success('تم الحذف');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold text-church-purple">مجتمعنا 📸</h1>

      <form onSubmit={handleUpload} className="card space-y-3">
        <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-church-pink rounded-2xl cursor-pointer hover:bg-pink-50 dark:hover:bg-gray-700">
          <FaImage className="text-4xl text-church-pink" />
          <span>{file ? file.name : 'اختر صورة أو فيديو'}</span>
          <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
        </label>
        <textarea className="input-field" placeholder="اكتب تعليقاً..." value={caption} onChange={(e) => setCaption(e.target.value)} />
        <button type="submit" className="btn-primary w-full">نشر 🎉</button>
      </form>

      {posts.map((post) => {
        const liked = post.likes?.includes(user?._id);
        return (
          <article key={post._id} className="card p-0 overflow-hidden">
            {post.mediaType === 'video' ? (
              <video src={post.media} controls className="w-full max-h-96 object-cover" />
            ) : (
              <img src={post.media} alt="" className="w-full max-h-96 object-cover" />
            )}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-church-purple text-white flex items-center justify-center font-bold">
                  {post.createdBy?.name?.[0]}
                </div>
                <div>
                  <p className="font-bold">{post.createdBy?.name}</p>
                  <p className="text-xs text-gray-500">{post.createdBy?.grade}</p>
                </div>
                {isAdmin && (
                  <button onClick={() => handleDelete(post._id)} className="mr-auto text-red-500"><FaTrash /></button>
                )}
              </div>
              {post.caption && <p>{post.caption}</p>}
              <div className="flex gap-4">
                <button onClick={() => handleLike(post._id)} className={`flex items-center gap-1 ${liked ? 'text-red-500' : ''}`}>
                  <FaHeart /> {post.likes?.length || 0}
                </button>
                <span className="flex items-center gap-1 text-gray-500"><FaComment /> {post.comments?.length || 0}</span>
              </div>
              {post.comments?.map((c) => (
                <div key={c._id} className="bg-gray-50 dark:bg-gray-700 p-2 rounded-xl text-sm">
                  <strong>{c.user?.name}: </strong>{c.text}
                </div>
              ))}
              <div className="flex gap-2">
                <input className="input-field flex-1 text-sm" placeholder="اكتب تعليقاً..." value={commentText[post._id] || ''} onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })} />
                <button type="button" onClick={() => handleComment(post._id)} className="btn-primary text-sm py-2">إرسال</button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default Community;
