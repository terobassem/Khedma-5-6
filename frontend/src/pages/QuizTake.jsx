import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const QuizTake = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    quizAPI.getOne(id).then((res) => setQuiz(res.data.data)).catch(() => toast.error('الاختبار غير موجود')).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = Object.entries(answers).map(([questionId, selectedAnswer]) => ({ questionId, selectedAnswer }));
    if (payload.length < quiz.questions.length) {
      toast.error('يرجى الإجابة على جميع الأسئلة');
      return;
    }
    setSubmitting(true);
    try {
      const res = await quizAPI.submit(id, payload);
      setResult(res.data.data);
      toast.success('تم إرسال إجاباتك!');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'فشل الإرسال');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!quiz) return <p className="text-center">الاختبار غير موجود</p>;

  if (result) {
    return (
      <div className="max-w-lg mx-auto card text-center">
        <span className="text-6xl">🎉</span>
        <h1 className="text-3xl font-extrabold text-church-purple mt-4">نتيجتك</h1>
        <p className="text-5xl font-bold text-church-pink my-6">{result.percentage}%</p>
        <p className="text-xl">{result.score} من {result.totalQuestions} إجابة صحيحة</p>
        <button onClick={() => navigate('/quizzes')} className="btn-primary mt-8">العودة للاختبارات</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-extrabold text-church-purple">{quiz.title}</h1>
      <p className="text-gray-600 dark:text-gray-300">{quiz.description}</p>

      {quiz.questions.map((q, i) => (
        <div key={q._id} className="card">
          <p className="font-bold text-lg mb-4">{i + 1}. {q.text}</p>
          <div className="space-y-2">
            {(q.options || []).map((opt) => (
              <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${answers[q._id] === opt ? 'border-church-purple bg-purple-50 dark:bg-gray-700' : 'border-gray-200 dark:border-gray-600'}`}>
                <input type="radio" name={q._id} value={opt} checked={answers[q._id] === opt} onChange={() => setAnswers({ ...answers, [q._id]: opt })} className="w-5 h-5" />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button type="submit" disabled={submitting} className="btn-primary w-full text-lg">
        {submitting ? 'جاري الإرسال...' : 'إرسال الإجابات ✓'}
      </button>
    </form>
  );
};

export default QuizTake;
