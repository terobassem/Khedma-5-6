import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto card mt-8">
      <h1 className="text-3xl font-extrabold text-center text-church-purple mb-6">تسجيل الدخول 🔐</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">البريد الإلكتروني</label>
          <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <label className="block font-semibold mb-1">كلمة المرور</label>
          <input type="password" className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'جاري الدخول...' : 'دخول'}</button>
      </form>
      <p className="text-center mt-4">ليس لديك حساب؟ <Link to="/register" className="text-church-pink font-bold">سجّل الآن</Link></p>
    </div>
  );
};

export default Login;
