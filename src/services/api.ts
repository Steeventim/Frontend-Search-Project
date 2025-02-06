import axios, { AxiosError } from "axios";

// Créer une instance d'axios
const api = axios.create({
  baseURL: "http://10.42.0.160:3003", // Remplacez par l'URL de votre API
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur de requête pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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

// Intercepteur de réponse pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;
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
