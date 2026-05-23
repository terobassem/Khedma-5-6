import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaTrash } from 'react-icons/fa';
import { quizAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const [newQuiz, setNewQuiz] = useState({
    title: '', description: '', grade: 'الكل',
    questions: [{ text: '', type: 'multiple', options: ['', '', '', ''], correctAnswer: '' }],
  });

  useEffect(() => {
    quizAPI.getAll().then((res) => setQuizzes(res.data.data)).catch(() => toast.error('فشل التحميل')).finally(() => setLoading(false));
  }, []);

  const addQuestion = () => {
    setNewQuiz({
      ...newQuiz,
      questions: [...newQuiz.questions, { text: '', type: 'multiple', options: ['', '', '', ''], correctAnswer: '' }],
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await quizAPI.create(newQuiz);
      toast.success('تم إنشاء الاختبار');
      const res = await quizAPI.getAll();
      setQuizzes(res.data.data);
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'فشل الإنشاء');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('حذف هذا الاختبار؟ سيتم حذف نتائج الطلاب المرتبطة به.')) return;
    try {
      await quizAPI.delete(id);
      setQuizzes((prev) => prev.filter((q) => q._id !== id));
      toast.success('تم حذف الاختبار');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'فشل الحذف');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold text-church-purple flex items-center gap-2"><FaClipboardList /> الاختبارات والمسابقات</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((q) => (
          <div key={q._id} className="card hover:scale-105 transition border-t-4 border-church-pink relative">
            {isAdmin && (
              <button
                type="button"
                onClick={() => handleDelete(q._id)}
                className="absolute top-3 end-3 text-red-500 hover:text-red-700 p-1"
                title="حذف الاختبار"
              >
                <FaTrash />
              </button>
            )}
            <h3 className="font-bold text-xl text-church-purple">{q.title}</h3>
            <p className="text-gray-500 mt-2">{q.description}</p>
            <p className="text-sm mt-2">عدد الأسئلة: {q.questions?.length || 0}</p>
            <Link to={`/quizzes/${q._id}`} className="btn-primary inline-block mt-4 text-sm">ابدأ الاختبار 🚀</Link>
          </div>
        ))}
      </div>

      {isAdmin && (
        <form onSubmit={handleCreate} className="card space-y-4 border-2 border-church-purple">
          <h2 className="font-bold text-xl">إنشاء اختبار جديد</h2>
          <input className="input-field" placeholder="عنوان الاختبار" value={newQuiz.title} onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })} required />
          <textarea className="input-field" placeholder="الوصف" value={newQuiz.description} onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })} />
          {newQuiz.questions.map((ques, qi) => (
            <div key={qi} className="p-4 bg-purple-50 dark:bg-gray-700 rounded-2xl space-y-2">
              <input className="input-field" placeholder="نص السؤال" value={ques.text} onChange={(e) => {
                const qs = [...newQuiz.questions]; qs[qi].text = e.target.value; setNewQuiz({ ...newQuiz, questions: qs });
              }} required />
              <select className="input-field" value={ques.type} onChange={(e) => {
                const qs = [...newQuiz.questions]; qs[qi].type = e.target.value;
                qs[qi].options = e.target.value === 'truefalse' ? ['صح', 'خطأ'] : ['', '', '', ''];
                setNewQuiz({ ...newQuiz, questions: qs });
              }}>
                <option value="multiple">اختيار من متعدد</option>
                <option value="truefalse">صح / خطأ</option>
              </select>
              {ques.options.map((opt, oi) => (
                <input key={oi} className="input-field" placeholder={`خيار ${oi + 1}`} value={opt} onChange={(e) => {
                  const qs = [...newQuiz.questions]; qs[qi].options[oi] = e.target.value; setNewQuiz({ ...newQuiz, questions: qs });
                }} />
              ))}
              <input className="input-field" placeholder="الإجابة الصحيحة" value={ques.correctAnswer} onChange={(e) => {
                const qs = [...newQuiz.questions]; qs[qi].correctAnswer = e.target.value; setNewQuiz({ ...newQuiz, questions: qs });
              }} required />
            </div>
          ))}
          <button type="button" onClick={addQuestion} className="btn-secondary">+ سؤال</button>
          <button type="submit" className="btn-primary w-full">إنشاء الاختبار</button>
        </form>
      )}
    </div>
  );
};

export default Quizzes;
