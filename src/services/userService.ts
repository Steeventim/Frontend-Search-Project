import api from "./api";
import type { User } from "../types/auth";

// Interface pour les données nécessaires à la création d'un utilisateur
// interface CreateUserData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   phone?: string;
//   isActive: boolean;
// }

// Interface pour les données nécessaires à la mise à jour d'un utilisateur
// interface UpdateUserData {
//   firstName?: string;
//   lastName?: string;
//   email?: string;
//   password?: string;
//   phone?: string;
//   isActive?: boolean; // Peut être optionnel lors de la mise à jour
// }

// Service utilisateur
export const userService = {
  // Récupérer tous les utilisateurs
  getUsers: async (): Promise<User[]> => {
    try {
      const { data } = await api.get("/users");
      // console.log("Données brutes de l'API :", data); // Vérifiez ici
      if (!Array.isArray(data)) {
        throw new Error("La réponse de l'API n'est pas un tableau.");
      }
      return data.map((user) => ({
        id: user.idUser, // Utilisation directe des propriétés de l'API
        email: user.Email,
        Nom: user.NomUser,
        Prenom: user.PrenomUser,
        roles: user.Roles, // Assurez-vous que cela correspond à votre type User
        IsActive: user.IsActive,
        Telephone: user.Telephone,
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      throw error; // Vous pouvez gérer l'erreur comme vous le souhaitez
    }
  },

  // Créer un nouvel utilisateur
  // createUser: async (userData: CreateUserData): Promise<User> => {
  //   try {
  //     const { data } = await api.post("/users", userData);
  //     return {
  //       id: data.idUser,
  //       email: data.Email,
  //       Nom: data.NomUser,
  //       Prenom: data.PrenomUser,
  //       roles: data.Roles,
  //       IsActive: data.IsActive,
  //       Telephone: data.Telephone,
  //     };
  //   } catch (error) {
  //     console.error("Erreur lors de la création de l'utilisateur :", error);
  //     throw error; // Gérer l'erreur comme vous le souhaitez
  //   }
  // },

  // // Mettre à jour un utilisateur existant
  // updateUser: async (id: string, userData: UpdateUserData): Promise<User> => {
  //   try {
  //     const { data } = await api.put(`/users/${id}`, userData);
  //     return {
  //       id: data.idUser,
  //       email: data.Email,
  //       Nom: data.NomUser,
  //       Prenom: data.PrenomUser,
  //       roles: data.Roles,
  //       IsActive: data.IsActive,
  //       Telephone: data.Telephone,
  //     };
  //   } catch (error) {
  //     console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
  //     throw error; // Gérer l'erreur comme vous le souhaitez
  //   }
  // },

  // // Supprimer un utilisateur
  // deleteUser: async (id: string): Promise<void> => {
  //   try {
  //     await api.delete(`/users/${id}`);
  //   } catch (error) {
  //     console.error("Erreur lors de la suppression de l'utilisateur :", error);
  //     throw error; // Gérer l'erreur comme vous le souhaitez
  //   }
  // },

  // Récupérer un utilisateur par son ID
  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await api.get(`/users/${id}`);
      const data = response.data;

      // console.log("Données de l'utilisateur récupérées :", data); // Vérifiez ici

      // Vérifiez si les données contiennent les propriétés attendues
      if (!data || !data.id) {
        throw new Error("Utilisateur non trouvé ou données invalides.");
      }

      // Utilisez directement les propriétés de l'API
      return {
        id: data.id, // Utilisez 'id' au lieu de 'idUser '
        email: data.email, // Utilisez 'email' au lieu de 'Email'
        Nom: data.nomUser, // Utilisez 'nomUser ' directement
        Prenom: data.prenomUser, // Utilisez 'prenomUser ' directement
        roles: data.roles, // Utilisez 'roles' directement
        IsActive: data.IsActive, // Si cette propriété existe, sinon retirez-la
        Telephone: data.Telephone, // Si cette propriété existe, sinon retirez-la
      };
    } catch (error: unknown) {
      // Affiner le type ici
      if (error instanceof Error) {
        console.error("Erreur de l'API :", error.message);
      } else if (typeof error === "object" && error !== null) {
        console.error("Erreur inconnue :", error);
      } else {
        console.error("Erreur inattendue :", error);
      }
      throw error; // Gérer l'erreur comme vous le souhaitez
    }
  },
};
