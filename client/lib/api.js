import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  
  register: (email, name, password) =>
    api.post('/auth/sign_up', { email, name, password }),
  
  getUser: () =>
    api.get('/auth/get_user'),
  listUsers: () =>
    api.get('/auth/list_users'),
};

// Chat API
export const chatAPI = {
  startChat: (targetUserId) =>
    api.post('/chat/start_chat', { targetUserId }),
  
  getChats: () =>
    api.get('/chat/get_chats'),
};

// Message API
export const messageAPI = {
  sendMessage: (roomId, text) =>
    api.post('/message/send_message', { roomId, text }),
  
  getMessages: (roomId) =>
    api.get(`/message/get_messages/${roomId}`),
  
  markAsRead: (roomId) =>
    api.get(`/message/mark_read/${roomId}`),
};

export default api;
