import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.getMe()
        .then((res) => setUser(res.data.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const data = res.data.data;
    localStorage.setItem('token', data.token);
    setUser(data);
    toast.success(`أهلاً ${data.name}! 🎉`);
    return data;
  };

  const register = async (formData) => {
    const res = await authAPI.register({ ...formData, role: 'student' });
    const data = res.data.data;
    localStorage.setItem('token', data.token);
    setUser(data);
    toast.success('تم التسجيل بنجاح!');
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('إلى اللقاء!');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
