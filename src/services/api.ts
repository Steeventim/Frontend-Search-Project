import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://10.100.213.23:3003",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
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
        // Ajoutez d'autres cas si nécessaire
        default:
          console.error("Erreur de l'API:", error.response.data);
          break;
      }
    } else {
      console.error("Erreur de réseau:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
