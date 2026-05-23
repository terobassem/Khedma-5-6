import { useEffect, useState } from 'react';
import { FaPlay, FaSearch, FaTrash } from 'react-icons/fa';
import { contentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const CATEGORIES = ['الكل', 'تسبيح', 'قصة كتابية', 'درس', 'ترانيم', 'عام'];

const Podcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('الكل');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', videoUrl: '', category: 'عام' });
  const { isAdmin } = useAuth();

  const fetchPodcasts = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category !== 'الكل') params.category = category;
    contentAPI.getPodcasts(params)
      .then((res) => setPodcasts(res.data.data))
      .catch(() => toast.error('فشل تحميل الفيديوهات'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPodcasts(); }, [search, category]);

  const getEmbedUrl = (url) => {
    if (url.includes('embed')) return url;
    const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await contentAPI.createPodcast(form);
      toast.success('تم رفع الفيديو');
      setForm({ title: '', description: '', videoUrl: '', category: 'عام' });
      fetchPodcasts();
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'فشل الرفع');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm('حذف هذا الفيديو؟')) return;
    try {
      await contentAPI.deletePodcast(id);
      setPodcasts((prev) => prev.filter((p) => p._id !== id));
      if (selected?._id === id) setSelected(null);
      toast.success('تم حذف الفيديو');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'فشل الحذف');
    }
  };

  return (
    
    <div className="space-y-8">
      
      <section
        className="relative overflow-hidden rounded-3xl p-8 md:p-16 h-screen min-h-[100vh] flex flex-col items-center justify-center text-white text-center shadow-2xl bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/لوجو.png')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        <div className="relative z-10">
          <span className="text-5xl md:text-6xl inline-block">🎬</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-4">فيديوهات و بودكاست</h1>
          <p className="text-lg md:text-xl mt-4 opacity-90 max-w-2xl mx-auto">
            شاهد حكاوي العجائبي والتسبيح ودروس الكتاب المقدس
          </p>
        </div>
      </section>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input-field pr-12" placeholder="ابحث عن فيديو..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input-field md:w-48" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {isAdmin && (
        <form onSubmit={handleUpload} className="card space-y-3 border-2 border-dashed border-church-purple">
          <h2 className="font-bold text-church-purple">رفع فيديو جديد (للمشرف)</h2>
          <input className="input-field" placeholder="العنوان" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea className="input-field" placeholder="الوصف" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <input className="input-field" placeholder="رابط يوتيوب" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} required />
          <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.filter((c) => c !== 'الكل').map((c) => <option key={c}>{c}</option>)}
          </select>
          <button type="submit" className="btn-primary">رفع</button>
        </form>
      )}

      {loading ? <LoadingSpinner /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.map((p) => (
            <div key={p._id} className="card p-0 overflow-hidden cursor-pointer hover:scale-105 transition" onClick={() => setSelected(p)}>
              <div className="aspect-video bg-purple-100 flex items-center justify-center">
                {p.thumbnail ? <img src={p.thumbnail} alt="" className="w-full h-full object-cover" /> : <FaPlay className="text-5xl text-church-purple" />}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs bg-church-yellow/40 px-2 py-1 rounded-full">{p.category}</span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, p._id)}
                      className="text-red-500 hover:text-red-700 p-1 shrink-0"
                      title="حذف الفيديو"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
                <h3 className="font-bold mt-2">{p.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-3xl w-full p-4" onClick={(e) => e.stopPropagation()}>
            <iframe className="w-full aspect-video rounded-2xl" src={getEmbedUrl(selected.videoUrl)} title={selected.title} allowFullScreen />
            <h2 className="text-xl font-bold mt-4">{selected.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">{selected.description}</p>
            <button onClick={() => setSelected(null)} className="btn-primary mt-4">إغلاق</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Podcasts;
