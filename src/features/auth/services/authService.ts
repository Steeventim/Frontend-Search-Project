import api from "../../../services/api";
import axios from "axios";
import { LoginCredentials, User, RegisterData } from "../../../types/auth";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    try {
      const response = await api.post("/users/login", credentials);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      return user;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error("Invalid credentials");
          case 400:
            throw new Error("Bad request. Please check your input.");
          default:
            throw new Error("An error occurred during login");
        }
      } else {
        throw new Error("Network or server error");
      }
    }
  },

  register: async (data: RegisterData): Promise<void> => {
    try {
      await api.post("/users/register", data);
      console.log("User registered successfully");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error("Bad request. Please check your input.");
          case 409:
            throw new Error("Email already in use.");
          default:
            throw new Error("An error occurred during registration");
        }
      } else {
        throw new Error("Network or server error");
      }
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/users/logout");
      localStorage.removeItem("token");
      console.log("User logged out successfully");
    } catch {
      throw new Error("An error occurred during logout");
    }
  },
};
