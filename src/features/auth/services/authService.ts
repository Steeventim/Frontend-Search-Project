import { User, LoginCredentials, RegisterData } from '../types';
import { mockUsers } from '../../../data/mockData';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const user = mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  },

  register: async (data: RegisterData): Promise<void> => {
    // TODO: Implement registration
    console.log('Registering user:', data);
  },

  logout: async (): Promise<void> => {
    // TODO: Implement logout
    console.log('Logging out');
  }
};