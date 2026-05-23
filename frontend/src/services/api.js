import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err.response?.data?.message || err.message || 'حدث خطأ')
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const contentAPI = {
  getHome: () => api.get('/content/home'),
  getPodcasts: (params) => api.get('/content/podcasts', { params }),
  createPodcast: (data) => api.post('/content/podcasts', data),
  deletePodcast: (id) => api.delete(`/content/podcasts/${id}`),
  createAnnouncement: (data) => api.post('/content/announcements', data),
  updateAnnouncement: (id, data) => api.put(`/content/announcements/${id}`, data),
  deleteAnnouncement: (id) => api.delete(`/content/announcements/${id}`),
  createEvent: (data) => api.post('/content/events', data),
  updateEvent: (id, data) => api.put(`/content/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/content/events/${id}`),
  createBibleVerse: (data) => api.post('/content/bible-verse', data),
  updateBibleVerse: (id, data) => api.put(`/content/bible-verse/${id}`, data),
};

export const quizAPI = {
  getAll: () => api.get('/quizzes'),
  getOne: (id) => api.get(`/quizzes/${id}`),
  submit: (id, answers) => api.post(`/quizzes/${id}/submit`, { answers }),
  getResults: () => api.get('/quizzes/results'),
  getLeaderboard: () => api.get('/quizzes/leaderboard'),
  create: (data) => api.post('/quizzes', data),
  delete: (id) => api.delete(`/quizzes/${id}`),
};

export const postAPI = {
  getAll: () => api.get('/posts'),
  create: (formData) => api.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  like: (id) => api.put(`/posts/${id}/like`),
  comment: (id, text) => api.post(`/posts/${id}/comments`, { text }),
  delete: (id) => api.delete(`/posts/${id}`),
};

export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics'),
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;
