import type { User, LoginCredentials, RegisterData } from '../types/auth';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validateRegistrationData = (data: RegisterData): string[] => {
  const errors: string[] = [];
  
  if (!validateEmail(data.email)) {
    errors.push('Email invalide');
  }
  
  if (!validatePassword(data.password)) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  
  if (!data.firstName.trim()) {
    errors.push('Le prénom est requis');
  }
  
  if (!data.lastName.trim()) {
    errors.push('Le nom est requis');
  }
  
  return errors;
};