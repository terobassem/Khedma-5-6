import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaBible, FaBell, FaCalendar, FaPlay, FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { contentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const emptyAnnouncement = { title: '', content: '' };
const emptyEvent = { title: '', description: '', date: '', location: 'كنيسة القديسين' };
const emptyVerse = { verse: '', reference: '' };

const toDateInput = (date) => {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  const [announcementForm, setAnnouncementForm] = useState(emptyAnnouncement);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);

  const [eventForm, setEventForm] = useState(emptyEvent);
  const [editingEventId, setEditingEventId] = useState(null);

  const [verseForm, setVerseForm] = useState(emptyVerse);

  const loadHome = () =>
    contentAPI.getHome()
      .then((res) => setData(res.data.data))
      .catch(() => setData({ announcements: [], podcasts: [], events: [], leaderboard: [], bibleVerse: null }));

  useEffect(() => {
    loadHome().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (data?.bibleVerse) {
      setVerseForm({ verse: data.bibleVerse.verse, reference: data.bibleVerse.reference });
    } else {
      setVerseForm(emptyVerse);
    }
  }, [data?.bibleVerse]);

  const refresh = async () => {
    const res = await contentAPI.getHome();
    setData(res.data.data);
  };

  const resetAnnouncementForm = () => {
    setAnnouncementForm(emptyAnnouncement);
    setEditingAnnouncementId(null);
  };

  const resetEventForm = () => {
    setEventForm(emptyEvent);
    setEditingEventId(null);
  };

  const saveAnnouncement = async (e) => {
    e.preventDefault();
    try {
      if (editingAnnouncementId) {
        await contentAPI.updateAnnouncement(editingAnnouncementId, announcementForm);
        toast.success('تم تحديث الإعلان');
      } else {
        await contentAPI.createAnnouncement(announcementForm);
        toast.success('تم إضافة الإعلان');
      }
      resetAnnouncementForm();
      await refresh();
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'فشل الحفظ');
    }
  };

  const editAnnouncement = (a) => {
    setEditingAnnouncementId(a._id);
    setAnnouncementForm({ title: a.title, content: a.content });
  };

  const deleteAnnouncement = async (id) => {
    if (!confirm('حذف هذا الإعلان؟')) return;
    try {
      await contentAPI.deleteAnnouncement(id);
      if (editingAnnouncementId === id) resetAnnouncementForm();
      toast.success('تم الحذف');
      await refresh();
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'فشل الحذف');
    }
  };

  const saveEvent = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...eventForm, date: new Date(eventForm.date).toISOString() };
      if (editingEventId) {
        await contentAPI.updateEvent(editingEventId, payload);
        toast.success('تم تحديث الفعالية');
      } else {
        await contentAPI.createEvent(payload);
        toast.success('تم إضافة الفعالية');
      }
      resetEventForm();
      await refresh();
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'فشل الحفظ');
    }
  };

  const editEvent = (ev) => {
    setEditingEventId(ev._id);
    setEventForm({
      title: ev.title,
      description: ev.description || '',
      date: toDateInput(ev.date),
      location: ev.location || 'كنيسة القديسين',
    });
  };

  const deleteEvent = async (id) => {
    if (!confirm('حذف هذه الفعالية؟')) return;
    try {
      await contentAPI.deleteEvent(id);
      if (editingEventId === id) resetEventForm();
      toast.success('تم الحذف');
      await refresh();
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'فشل الحذف');
    }
  };

  const saveVerse = async (e) => {
    e.preventDefault();
    try {
      if (data?.bibleVerse?._id) {
        await contentAPI.updateBibleVerse(data.bibleVerse._id, { ...verseForm, isActive: true });
        toast.success('تم تحديث الآية');
      } else {
        await contentAPI.createBibleVerse(verseForm);
        toast.success('تم إضافة الآية');
      }
      await refresh();
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'فشل الحفظ');
    }
  };

  if (loading) return <LoadingSpinner />;

  const { announcements, podcasts, events, leaderboard, bibleVerse } = data || {};

  return (
    <div className="space-y-12">
      <section
        className="relative overflow-hidden rounded-3xl p-8 md:p-16 min-h-[320px] md:min-h-[420px] text-white text-center shadow-2xl bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://res.cloudinary.com/dslgdi2se/image/upload/v1779654816/%D8%AE%D8%AF%D9%85%D8%A9_htyyfs.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mt-4">خدمة خامسة وسادسة</h1>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Link to="/register" className="border-2 border-white font-bold px-8 py-3 rounded-2xl hover:scale-105 transition shadow-lg">
              سجل دلوقتي 🎉
            </Link>
            <Link to="/podcasts" className="border-2 border-white font-bold px-8 py-3 rounded-2xl hover:bg-white/20 transition">
              حكاوي العجائبي
            </Link>
          </div>
        </div>
      </section>

      {(bibleVerse || isAdmin) && (
        <section className="card bg-gradient-to-r from-church-blue/10 to-church-green/10 border-2 border-church-blue">
          <div className="flex items-start gap-4">
            <FaBible className="text-4xl text-church-blue shrink-0" />
            <div className="flex-1">
              {bibleVerse && !isAdmin && (
                <>
                  <p className="text-xl font-bold italic leading-relaxed">"{bibleVerse.verse}"</p>
                  <p className="text-church-purple font-semibold mt-2">— {bibleVerse.reference}</p>
                </>
              )}
              {isAdmin && (
                <form onSubmit={saveVerse} className="space-y-3">
                  <h3 className="font-bold text-church-purple">آية اليوم (للمشرف)</h3>
                  <textarea className="input-field" placeholder="نص الآية" value={verseForm.verse} onChange={(e) => setVerseForm({ ...verseForm, verse: e.target.value })} required />
                  <input className="input-field" placeholder="المرجع (مثال: يوحنا 3:16)" value={verseForm.reference} onChange={(e) => setVerseForm({ ...verseForm, reference: e.target.value })} required />
                  <button type="submit" className="btn-primary text-sm">{bibleVerse ? 'حفظ التعديل' : 'إضافة الآية'}</button>
                </form>
              )}
            </div>
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-extrabold text-church-purple flex items-center gap-2 mb-6"><FaBell /> آخر الإعلانات</h2>
        {isAdmin && (
          <form onSubmit={saveAnnouncement} className="card space-y-3 mb-6 border-2 border-dashed border-church-purple">
            <h3 className="font-bold text-church-purple flex items-center gap-2">
              {editingAnnouncementId ? <FaEdit /> : <FaPlus />}
              {editingAnnouncementId ? 'تعديل إعلان' : 'إضافة إعلان جديد'}
            </h3>
            <input className="input-field" placeholder="العنوان" value={announcementForm.title} onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })} required />
            <textarea className="input-field" placeholder="المحتوى" value={announcementForm.content} onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })} required />
            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-sm">{editingAnnouncementId ? 'حفظ' : 'إضافة'}</button>
              {editingAnnouncementId && (
                <button type="button" onClick={resetAnnouncementForm} className="btn-secondary text-sm">إلغاء</button>
              )}
            </div>
          </form>
        )}
        <div className="grid md:grid-cols-2 gap-4">
          {(announcements || []).map((a) => (
            <div key={a._id} className="card hover:scale-[1.02] transition border-r-4 border-church-yellow relative">
              {isAdmin && (
                <div className="absolute top-3 end-3 flex gap-2">
                  <button type="button" onClick={() => editAnnouncement(a)} className="text-church-purple hover:opacity-80" title="تعديل"><FaEdit /></button>
                  <button type="button" onClick={() => deleteAnnouncement(a._id)} className="text-red-500 hover:text-red-700" title="حذف"><FaTrash /></button>
                </div>
              )}
              <h3 className="font-bold text-lg text-church-purple pe-16">{a.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{a.content}</p>
            </div>
          ))}
          {!announcements?.length && <p className="text-gray-500">لا توجد إعلانات حالياً</p>}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-church-purple flex items-center gap-2"><FaPlay /> أحدث الفيديوهات</h2>
          <Link to="/podcasts" className="text-church-pink font-bold hover:underline">عرض الكل ←</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(podcasts || []).map((p) => (
            <Link key={p._id} to="/podcasts" className="card p-0 overflow-hidden hover:scale-105 transition group">
              <div className="aspect-video bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                {p.thumbnail ? <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" /> : <FaPlay className="text-4xl text-church-purple group-hover:scale-125 transition" />}
              </div>
              <div className="p-4">
                <span className="text-xs bg-church-yellow/30 text-church-purple px-2 py-1 rounded-full">{p.category}</span>
                <h3 className="font-bold mt-2">{p.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-extrabold text-church-purple flex items-center gap-2 mb-6"><FaTrophy /> المتصدرون</h2>
          <div className="card space-y-3">
            {(leaderboard || []).map((s, i) => (
              <div key={s._id} className="flex items-center gap-4 p-3 rounded-2xl bg-gradient-to-l from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600">
                <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-amber-600' : 'bg-church-purple'}`}>{i + 1}</span>
                <div className="flex-1">
                  <p className="font-bold">{s.name}</p>
                  <p className="text-sm text-gray-500">{s.grade}</p>
                </div>
                <span className="font-extrabold text-church-purple">{s.totalScore} نقطة</span>
              </div>
            ))}
            <Link to="/leaderboard" className="block text-center text-church-pink font-bold mt-4">عرض لوحة المتصدرين</Link>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold text-church-purple flex items-center gap-2 mb-6"><FaCalendar /> الفعاليات القادمة</h2>
          {isAdmin && (
            <form onSubmit={saveEvent} className="card space-y-3 mb-6 border-2 border-dashed border-church-green">
              <h3 className="font-bold text-church-green flex items-center gap-2">
                {editingEventId ? <FaEdit /> : <FaPlus />}
                {editingEventId ? 'تعديل فعالية' : 'إضافة فعالية جديدة'}
              </h3>
              <input className="input-field" placeholder="العنوان" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required />
              <textarea className="input-field" placeholder="الوصف" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} required />
              <input type="datetime-local" className="input-field" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} required />
              <input className="input-field" placeholder="المكان" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary text-sm">{editingEventId ? 'حفظ' : 'إضافة'}</button>
                {editingEventId && (
                  <button type="button" onClick={resetEventForm} className="btn-secondary text-sm">إلغاء</button>
                )}
              </div>
            </form>
          )}
          <div className="space-y-3">
            {(events || []).map((e) => (
              <div key={e._id} className="card flex gap-4 items-center border-l-4 border-church-green relative">
                {isAdmin && (
                  <div className="absolute top-3 end-3 flex gap-2">
                    <button type="button" onClick={() => editEvent(e)} className="text-church-green hover:opacity-80" title="تعديل"><FaEdit /></button>
                    <button type="button" onClick={() => deleteEvent(e._id)} className="text-red-500 hover:text-red-700" title="حذف"><FaTrash /></button>
                  </div>
                )}
                <div className="bg-church-green text-white rounded-2xl p-3 text-center min-w-[70px]">
                  <p className="text-2xl font-bold">{new Date(e.date).getDate()}</p>
                  <p className="text-xs">{new Date(e.date).toLocaleDateString('ar-EG', { month: 'short' })}</p>
                </div>
                <div className="pe-14">
                  <h3 className="font-bold">{e.title}</h3>
                  <p className="text-sm text-gray-500">{e.location}</p>
                </div>
              </div>
            ))}
            {!events?.length && <p className="text-gray-500 card">لا توجد فعاليات قادمة</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
