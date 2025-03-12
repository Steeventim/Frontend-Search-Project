import api from "./api";
import type { User } from "../types/auth";

interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
}

interface ServerUserData {
  id: string;
  email: string;
  nomUser: string;
  prenomUser: string;
  roles: string[];
}

const mapServerUserDataToUser = (data: ServerUserData): User => ({
  id: data.id,
  email: data.email,
  Nom: data.prenomUser,
  Prenom: data.nomUser,
  roles: data.roles,
});

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const { data } = await api.get("/users");
    return data.map(mapServerUserDataToUser);
  },

  createUser: async (userData: CreateUserData): Promise<User> => {
    const { data } = await api.post("/users", userData);
    return mapServerUserDataToUser(data);
  },

  updateUser: async (id: string, userData: UpdateUserData): Promise<User> => {
    const { data } = await api.put(`/users/${id}`, userData);
    return mapServerUserDataToUser(data);
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  getUserById: async (id: string): Promise<User> => {
    const { data } = await api.get(`/users/${id}`);
    return mapServerUserDataToUser(data);
  },
};
