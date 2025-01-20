import api from './api';
import type { User, LoginCredentials, RegisterData } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    return data;
  },

  register: async (registerData: RegisterData): Promise<{ user: User; token: string }> => {
    const { data } = await api.post('/auth/register', registerData);
    localStorage.setItem('token', data.token);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const { data } = await api.put('/auth/profile', userData);
    return data;
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await api.post('/auth/change-password', { oldPassword, newPassword });
  }
};