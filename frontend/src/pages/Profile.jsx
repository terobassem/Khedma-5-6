import { useEffect, useState } from 'react';
import { FaUser, FaStar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { authAPI, quizAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [results, setResults] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', grade: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, phone: user.phone || '', grade: user.grade || '' });
      Promise.all([
        authAPI.getMe(),
        quizAPI.getResults(),
      ]).then(([me, res]) => {
        setUser(me.data.data);
        setResults(res.data.data);
      }).finally(() => setLoading(false));
    }
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.updateProfile(form);
      setUser(res.data.data);
      toast.success('تم تحديث الملف');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'فشل التحديث');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="card text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-church-purple to-church-pink text-white flex items-center justify-center text-4xl font-bold">
          {user?.name?.[0]}
        </div>
        <h1 className="text-2xl font-extrabold mt-4 text-church-purple">{user?.name}</h1>
        <p className="text-gray-500">{user?.email}</p>
        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-church-pink">{user?.totalScore || 0}</p>
            <p className="text-sm text-gray-500">نقاط</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-church-purple">{user?.quizzesTaken || 0}</p>
            <p className="text-sm text-gray-500">اختبارات</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="card space-y-4">
        <h2 className="font-bold flex items-center gap-2"><FaUser /> تعديل الملف</h2>
        {['name', 'phone', 'grade'].map((key) => (
          <div key={key}>
            <label className="block font-semibold mb-1">{key === 'name' ? 'الاسم' : key === 'phone' ? 'الهاتف' : 'الصف'}</label>
            <input className="input-field" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </div>
        ))}
        <button type="submit" className="btn-primary">حفظ التغييرات</button>
      </form>

      <div className="card">
        <h2 className="font-bold flex items-center gap-2 mb-4"><FaStar /> نتائج الاختبارات</h2>
        {results.length ? results.map((r) => (
          <div key={r._id} className="flex justify-between items-center p-3 rounded-xl bg-purple-50 dark:bg-gray-700 mb-2">
            <span>{r.quiz?.title}</span>
            <span className="font-bold text-church-purple">{r.percentage}%</span>
          </div>
        )) : <p className="text-gray-500">لم تجري أي اختبارات بعد</p>}
      </div>
    </div>
  );
};

export default Profile;
