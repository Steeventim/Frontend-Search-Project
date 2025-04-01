// src/types/auth.ts
export interface User {
  IsActive: boolean | undefined;
  id: string;
  Nom: string;
  Prenom: string;
  email: string;
  roles: string[];
  Telephone?: string; // Ajout de la propriété Téléphone si nécessaire
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserFormData {
  Nom: string; // Nom de l'utilisateur
  Prenom: string; // Prénom de l'utilisateur
  Email: string; // Email de l'utilisateur
  Password: string; // Mot de passe de l'utilisateur
  Telephone?: string; // Téléphone de l'utilisateur (optionnel)
  IsActive?: boolean; // Statut d'activation de l'utilisateur
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string; // Optionnel
  isActive?: boolean; // Assurez-vous que c'est bien 'isActive'
}
