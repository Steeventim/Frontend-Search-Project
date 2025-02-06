import type { RegisterData } from "../types/auth";

// Constantes pour les expressions régulières
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

/**
 * Valide une adresse email.
 * @param email - L'adresse email à valider.
 * @returns true si l'email est valide, false sinon.
 */
export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

/**
 * Valide un mot de passe.
 * @param password - Le mot de passe à valider.
 * @returns true si le mot de passe est valide, false sinon.
 */
export const validatePassword = (password: string): boolean => {
  return PASSWORD_REGEX.test(password);
};

/**
 * Valide les données d'enregistrement.
 * @param data - Les données d'enregistrement à valider.
 * @returns Un tableau de messages d'erreur, vide si les données sont valides.
 */
export const validateRegistrationData = (data: RegisterData): string[] => {
  const errors: string[] = [];

  if (!validateEmail(data.email)) {
    errors.push("L'adresse email est invalide.");
  }

  if (!validatePassword(data.password)) {
    errors.push(
      "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial."
    );
  }

  if (!data.firstName.trim()) {
    errors.push("Le prénom est requis.");
  }

  if (!data.lastName.trim()) {
    errors.push("Le nom de famille est requis.");
  }

  return errors;
};
