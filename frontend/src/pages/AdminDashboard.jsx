import { useEffect, useState } from 'react';
import { FaUsers, FaClipboardList, FaImages, FaChartBar, FaTrash } from 'react-icons/fa';
import { adminAPI, postAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className={`card flex items-center gap-4 border-r-4 ${color}`}>
    <Icon className="text-4xl opacity-70" />
    <div>
      <p className="text-3xl font-extrabold">{value}</p>
      <p className="text-gray-500">{label}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [a, u, p] = await Promise.all([
        adminAPI.getAnalytics(),
        adminAPI.getUsers(),
        postAPI.getAll(),
      ]);
      setAnalytics(a.data.data);
      setUsers(u.data.data);
      setPosts(p.data.data);
    } catch {
      toast.error('فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const deleteUser = async (id) => {
    if (!confirm('حذف هذا المستخدم؟')) return;
    await adminAPI.deleteUser(id);
    setUsers(users.filter((u) => u._id !== id));
    toast.success('تم الحذف');
  };

  const deletePost = async (id) => {
    if (!confirm('حذف هذا المنشور؟')) return;
    await postAPI.delete(id);
    setPosts(posts.filter((p) => p._id !== id));
    toast.success('تم الحذف');
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold text-church-purple flex items-center gap-2">
        <FaChartBar /> لوحة تحكم المشرف
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={FaUsers} label="إجمالي المستخدمين" value={analytics?.totalUsers} color="border-church-blue" />
        <StatCard icon={FaClipboardList} label="إجمالي الاختبارات" value={analytics?.totalQuizzes} color="border-church-purple" />
        <StatCard icon={FaImages} label="إجمالي المنشورات" value={analytics?.totalPosts} color="border-church-pink" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="font-bold text-xl mb-4 text-church-purple">أفضل الطلاب</h2>
          {(analytics?.topStudents || []).map((s, i) => (
            <div key={s._id} className="flex justify-between py-2 border-b dark:border-gray-700 last:border-0">
              <span>{i + 1}. {s.name} ({s.grade})</span>
              <span className="font-bold text-church-pink">{s.totalScore} نقطة</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 className="font-bold text-xl mb-4 text-church-purple">آخر نتائج الاختبارات</h2>
          {(analytics?.recentResults || []).map((r) => (
            <div key={r._id} className="flex justify-between py-2 border-b dark:border-gray-700 last:border-0 text-sm">
              <span>{r.student?.name} - {r.quiz?.title}</span>
              <span className="font-bold">{r.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card overflow-x-auto">
        <h2 className="font-bold text-xl mb-4 flex items-center gap-2"><FaUsers /> المستخدمون</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-right p-2">الاسم</th>
              <th className="text-right p-2">البريد</th>
              <th className="text-right p-2">الدور</th>
              <th className="text-right p-2">الصف</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b dark:border-gray-700">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role === 'admin' ? 'مشرف' : 'طالب'}</td>
                <td className="p-2">{u.grade}</td>
                <td className="p-2">
                  {u.role !== 'admin' && (
                    <button onClick={() => deleteUser(u._id)} className="text-red-500"><FaTrash /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2 className="font-bold text-xl mb-4">إدارة المنشورات</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {posts.slice(0, 6).map((p) => (
            <div key={p._id} className="flex gap-3 items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-xl">
              {p.mediaType === 'image' && <img src={p.media} alt="" className="w-16 h-16 rounded-lg object-cover" />}
              <p className="flex-1 text-sm truncate">{p.caption || 'بدون تعليق'}</p>
              <button onClick={() => deletePost(p._id)} className="text-red-500"><FaTrash /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
