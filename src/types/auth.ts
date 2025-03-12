// src/types/auth.ts
export interface User {
  id: string;
  Nom: string;
  Prenom: string;
  email: string;
  roles: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  companyName: string;
  position: string;
}
