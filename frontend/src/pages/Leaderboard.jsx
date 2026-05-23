import { useEffect, useState } from 'react';
import { FaTrophy, FaMedal } from 'react-icons/fa';
import { quizAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const medals = ['🥇', '🥈', '🥉'];

const Leaderboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    quizAPI.getLeaderboard()
      .then((res) => setStudents(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-extrabold text-center text-church-purple flex items-center justify-center gap-2">
        <FaTrophy className="text-church-yellow" /> لوحة المتصدرين
      </h1>

      <div className="space-y-4">
        {students.map((s, i) => (
          <div
            key={s._id}
            className={`card flex items-center gap-4 ${i < 3 ? 'bg-gradient-to-l from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-church-yellow' : ''}`}
          >
            <span className="text-3xl w-12 text-center">{medals[i] || `#${i + 1}`}</span>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-church-purple to-church-pink text-white flex items-center justify-center text-2xl font-bold">
              {s.name?.[0]}
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-lg">{s.name}</p>
              <p className="text-sm text-gray-500">{s.grade} • {s.quizzesTaken} اختبار</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-church-purple">{s.totalScore}</p>
              <p className="text-xs text-gray-500">نقطة</p>
            </div>
          </div>
        ))}
        {!students.length && <p className="text-center text-gray-500 card">لا يوجد طلاب بعد</p>}
      </div>
    </div>
  );
};

export default Leaderboard;
