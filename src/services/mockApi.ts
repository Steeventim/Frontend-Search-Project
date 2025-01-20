import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import api from './api';

// Create mock instance
const mock = new MockAdapter(api, { delayResponse: 1000 });

// Mock users data
const users = [
  {
    id: '1',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33612345678',
    role: 'admin'
  },
  {
    id: '2',
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@example.com',
    phone: '+33687654321',
    role: 'user'
  }
];

// Mock auth endpoints
mock.onPost('/auth/login').reply((config) => {
  const { email, password } = JSON.parse(config.data);
  const user = users.find(u => u.email === email);
  
  if (user) {
    return [200, { user, token: 'mock-jwt-token' }];
  }
  return [401, { message: 'Invalid credentials' }];
});

mock.onGet('/auth/me').reply((config) => {
  const token = config.headers?.Authorization;
  if (token) {
    return [200, users[0]];
  }
  return [401, { message: 'Unauthorized' }];
});

// Mock users endpoints
mock.onGet('/users').reply(200, users);

mock.onPost('/users').reply((config) => {
  const newUser = {
    id: (users.length + 1).toString(),
    ...JSON.parse(config.data),
    role: 'user'
  };
  users.push(newUser);
  return [201, newUser];
});

mock.onPut(/\/users\/\d+/).reply((config) => {
  const id = config.url?.split('/').pop();
  const userData = JSON.parse(config.data);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...userData };
    return [200, users[userIndex]];
  }
  return [404, { message: 'User not found' }];
});

mock.onDelete(/\/users\/\d+/).reply((config) => {
  const id = config.url?.split('/').pop();
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    return [200];
  }
  return [404, { message: 'User not found' }];
});