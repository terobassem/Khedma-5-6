import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', age: '', grade: '', phone: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ ...form, age: Number(form.age) });
      navigate('/');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'فشل التسجيل');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'الاسم', type: 'text' },
    { key: 'age', label: 'العمر', type: 'number' },
    { key: 'grade', label: 'الصف الدراسي', type: 'text' },
    { key: 'phone', label: 'رقم الهاتف', type: 'tel' },
    { key: 'email', label: 'البريد الإلكتروني', type: 'email' },
    { key: 'password', label: 'كلمة المرور', type: 'password' },
  ];

  return (
    <div className="max-w-lg mx-auto card mt-8">
      <h1 className="text-3xl font-extrabold text-center text-church-purple mb-6">تسجيل طالب جديد 🌟</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="block font-semibold mb-1">{f.label}</label>
            <input type={f.type} className="input-field" value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} required min={f.key === 'age' ? 4 : undefined} max={f.key === 'age' ? 18 : undefined} />
          </div>
        ))}
        <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'جاري التسجيل...' : 'تسجيل'}</button>
      </form>
      <p className="text-center mt-4">لديك حساب؟ <Link to="/login" className="text-church-pink font-bold">سجّل دخولك</Link></p>
    </div>
  );
};

export default Register;
