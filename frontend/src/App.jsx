import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Podcasts from './pages/Podcasts';
import Quizzes from './pages/Quizzes';
import QuizTake from './pages/QuizTake';
import Community from './pages/Community';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/podcasts" element={<Podcasts />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/quizzes" element={<ProtectedRoute><Quizzes /></ProtectedRoute>} />
        <Route path="/quizzes/:id" element={<ProtectedRoute><QuizTake /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </Layout>
  );
}

export default App;
