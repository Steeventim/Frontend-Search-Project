import api from "./api";
import axios from "axios";
import type { User, LoginCredentials, RegisterData } from "../types/auth";

export const authService = {
  login: async (
    credentials: LoginCredentials
  ): Promise<{ user: User; token: string }> => {
    try {
      const { data } = await api.post("/users/login", credentials);
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error("Bad request. Please check your input.");
          case 401:
            throw new Error("Invalid credentials.");
          default:
            throw new Error("An error occurred during login.");
        }
      } else {
        throw new Error("Network or server error.");
      }
    }
  },

  register: async (
    registerData: RegisterData
  ): Promise<{ user: User; token: string }> => {
    try {
      const { data } = await api.post("/users/register", registerData);
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error("Bad request. Please check your input.");
          case 409:
            throw new Error("Email already in use.");
          default:
            throw new Error("An error occurred during registration.");
        }
      } else {
        throw new Error("Network or server error.");
      }
    }
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get("/users/current");
    return data;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem("token");
  },
};
