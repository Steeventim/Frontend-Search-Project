export const validateRequired = (value: string): string | undefined => {
  return value.trim() ? undefined : 'Ce champ est requis';
};

export const validateEmail = (email: string): string | undefined => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? undefined : 'Email invalide';
};

export const validatePassword = (password: string): string | undefined => {
  if (password.length < 8) {
    return 'Le mot de passe doit contenir au moins 8 caractères';
  }
  return undefined;
};