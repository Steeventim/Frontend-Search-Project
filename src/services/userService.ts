import api from './api';
import type { User } from '../types/auth';

interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
}

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const { data } = await api.get('/users');
    return data;
  },

  createUser: async (userData: CreateUserData): Promise<User> => {
    const { data } = await api.post('/users', userData);
    return data;
  },

  updateUser: async (id: string, userData: UpdateUserData): Promise<User> => {
    const { data } = await api.put(`/users/${id}`, userData);
    return data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  getUserById: async (id: string): Promise<User> => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  }
};