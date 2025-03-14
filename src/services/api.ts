import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

// Créer une instance d'axios
const api = axios.create({
  baseURL: "http://localhost:3003", // Remplacez par l'URL de votre API
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur de requête pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Gérer les erreurs de requête
    return Promise.reject(error);
  }
);

// Fonction pour rafraîchir le token
const refreshToken = async () => {
  try {
    const refreshToken = Cookies.get("refreshToken");

    const response = await api.post("/auth/refresh-token", {
      refreshToken,
    });

    const { token, refreshToken: newRefreshToken } = response.data;

    Cookies.set("token", token, { expires: 1 / 24 }); // 1 heures

    Cookies.set("refreshToken", newRefreshToken, { expires: 7 }); // 7 jours

    return token;
  } catch (error) {
    console.error("Erreur lors du rafraîchissement du token:", error);

    Cookies.remove("token");

    Cookies.remove("refreshToken");

    window.location.href = "/login";

    return null;
  }
};

// Intercepteur de réponse pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401: {
          // Essayer de rafraîchir le token
          const newToken = await refreshToken();
          if (newToken) {
            // Réessayer la requête initiale avec le nouveau token
            if (error.config && error.config.headers) {
              error.config.headers.Authorization = `Bearer ${newToken}`;
            }
            if (error.config) {
              return axios.request(error.config);
            }
          }
          break;
        }
        case 403:
          console.error("Accès interdit");
          break;
        case 404:
          console.error("Ressource non trouvée");
          break;
        default:
          console.error("Erreur inconnue");
      }
    } else {
      console.error("Erreur réseau ou serveur");
    }
    return Promise.reject(error);
  }
);

export default api;
