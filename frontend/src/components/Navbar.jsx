import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { HiMenu, HiX, HiMoon, HiSun } from 'react-icons/hi';
import { FaChurch, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const links = [
  { to: '/', label: 'الرئيسية' },
  { to: '/podcasts', label: 'بودكاست' },
  { to: '/quizzes', label: 'اختبارات' },
  { to: '/community', label: 'ميني فيسبوك' },
  { to: '/leaderboard', label: 'الاوائل' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const navClass = ({ isActive }) =>
    `px-3 py-2 rounded-xl font-semibold transition ${isActive ? 'bg-church-purple text-white' : 'hover:bg-purple-100 dark:hover:bg-gray-700'}`;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg border-b-4 border-church-yellow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-church-purple">
          <FaChurch className="text-church-yellow text-3xl" />
          <span>خدمة خامسة وسادسة ✝️</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => <NavLink key={l.to} to={l.to} className={navClass}>{l.label}</NavLink>)}
          {isAdmin && <NavLink to="/admin" className={navClass}>لوحة التحكم</NavLink>}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggle} className="p-2 rounded-xl bg-purple-100 dark:bg-gray-700" aria-label="الوضع الليلي">
            {dark ? <HiSun className="text-yellow-400 text-xl" /> : <HiMoon className="text-church-purple text-xl" />}
          </button>
          {user ? (
            <>
              <Link to="/profile" className="hidden sm:flex items-center gap-1 btn-secondary text-sm py-2">
                <FaUser /> {user.name}
              </Link>
              <button onClick={() => { logout(); navigate('/'); }} className="btn-primary text-sm py-2">خروج</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-sm py-2">دخول</Link>
              <Link to="/register" className="btn-primary text-sm py-2">سجل حساب جديد</Link>
            </>
          )}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-2 border-t dark:border-gray-700">
          {links.map((l) => <NavLink key={l.to} to={l.to} className={navClass} onClick={() => setOpen(false)}>{l.label}</NavLink>)}
          {isAdmin && <NavLink to="/admin" className={navClass} onClick={() => setOpen(false)}>لوحة التحكم</NavLink>}
          {user && <NavLink to="/profile" className={navClass} onClick={() => setOpen(false)}>ملفي</NavLink>}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
