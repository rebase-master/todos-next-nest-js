export interface User {
  id: number;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  username: string;
  password: string;
}

export enum TodoStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export interface Todo {
  id: number;
  name: string;
  description: string;
  status: TodoStatus;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface CreateTodoRequest {
  name: string;
  description: string;
  status?: TodoStatus;
} 