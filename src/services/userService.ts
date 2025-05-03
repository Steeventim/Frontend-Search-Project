import api from "./api";
import type { User } from "../types/auth";

// Interface pour les données nécessaires à la création d'un utilisateur
interface CreateUserData {
  email: string;
  password: string;
  nomUser: string;
  prenomUser: string;
  roles?: string[]; // Optionnel, selon les besoins de l'API
  IsActive?: boolean; // Optionnel, avec une valeur par défaut côté backend
  Telephone?: string; // Optionnel
}

// Interface pour les données nécessaires à la mise à jour d'un utilisateur
interface UpdateUserData {
  email?: string;
  password?: string;
  nomUser?: string;
  prenomUser?: string;
  roles?: string[];
  IsActive?: boolean;
  Telephone?: string;
}

// Service utilisateur
export const userService = {
  // Récupérer tous les utilisateurs
  getUsers: async (): Promise<User[]> => {
    try {
      const { data } = await api.get("/users");
      if (!Array.isArray(data)) {
        throw new Error("La réponse de l'API n'est pas un tableau.");
      }
      return data.map((user) => ({
        id: user.id || user.idUser, // Gérer les deux formats possibles
        email: user.email || user.Email,
        Nom: user.nomUser || user.NomUser,
        Prenom: user.prenomUser || user.PrenomUser,
        roles: user.roles || user.Roles || [],
        IsActive: user.IsActive ?? true, // Valeur par défaut si undefined
        Telephone: user.Telephone || null,
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      throw error;
    }
  },

  // Créer un nouvel utilisateur
  createUser: async (userData: CreateUserData): Promise<User> => {
    try {
      const { data } = await api.post("/users/register", userData);
      return {
        id: data.id || data.idUser,
        email: data.email || data.Email,
        NomUser: data.NomUser || data.NomUser,
        Prenom: data.prenomUser || data.PrenomUser,
        roles: data.roles || data.Roles || [],
        IsActive: data.IsActive ?? true,
        Telephone: data.Telephone || null,
      };
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur :", error);
      throw error;
    }
  },

  // Mettre à jour un utilisateur existant
  updateUser: async (id: string, userData: UpdateUserData): Promise<User> => {
    try {
      const { data } = await api.put(`/users/${id}`, userData);
      return {
        id: data.id || data.idUser,
        email: data.email || data.Email,
        Nom: data.nomUser || data.NomUser,
        Prenom: data.prenomUser || data.PrenomUser,
        roles: data.roles || data.Roles || [],
        IsActive: data.IsActive ?? true,
        Telephone: data.Telephone || null,
      };
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
      throw error;
    }
  },

  // Supprimer un utilisateur
  deleteUser: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
      throw error;
    }
  },

  // Récupérer un utilisateur par son ID
  getUserById: async (id: string): Promise<User> => {
    try {
      const { data } = await api.get(`/users/${id}`);
      if (!data || !data.id) {
        throw new Error("Utilisateur non trouvé ou données invalides.");
      }
      return {
        id: data.id || data.idUser,
        email: data.email || data.Email,
        Nom: data.nomUser || data.NomUser,
        Prenom: data.prenomUser || data.PrenomUser,
        roles: data.roles || data.Roles || [],
        IsActive: data.IsActive ?? true,
        Telephone: data.Telephone || null,
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'utilisateur par ID :",
        error
      );
      throw error;
    }
  },
};
