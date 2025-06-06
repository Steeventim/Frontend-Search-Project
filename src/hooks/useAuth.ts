import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { User, LoginCredentials } from "../types/auth";
import { authService } from "../services/authService";
import { ROUTES } from "../constants/routes";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setLoading(true);
      setError(null);
      try {
        const { user: loggedInUser } = await authService.login(credentials);
        setUser(loggedInUser);

        if (
          loggedInUser.roles[0] === "admin" ||
          loggedInUser.roles[0] === "superadmin"
        ) {
          navigate(ROUTES.ADMIN.DASHBOARD);
        } else if (loggedInUser.roles.length > 0) {
          navigate(ROUTES.USER.DASHBOARD);
        } else {
          navigate(ROUTES.ERROR); // Redirection pour les rôles non reconnus
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      navigate(ROUTES.AUTH.LOGIN);
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
    }
  }, [navigate]);

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };
};
