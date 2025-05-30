import axios from 'axios';
import { AuthResponse, LoginRequest, SignupRequest, Todo, CreateTodoRequest } from '@/types';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },
};

export const todosApi = {
  getAllTodos: async (): Promise<Todo[]> => {
    const response = await api.get('/todos');
    return response.data;
  },

  createTodo: async (data: CreateTodoRequest): Promise<Todo> => {
    const response = await api.post('/todos', data);
    return response.data;
  },

  getMyTodos: async (): Promise<Todo[]> => {
    const response = await api.get('/todos/my-todos');
    return response.data;
  },
};

export default api; 