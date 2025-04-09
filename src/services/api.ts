import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

// Types personnalisés
interface QueueItem {
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Configuration des constantes
const TOKEN_EXPIRATION = 3 / 24; // 3 heures
const REFRESH_TOKEN_EXPIRATION = 7; // 7 jours

const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 secondes
};

// Routes qui ne déclenchent pas de refresh token
const noRefreshRoutes = [
  "/refresh-token",
  "/login",
  "/register",
  "/logout",
  "/init/admin",
];

// Création de l'instance axios
const api = axios.create(API_CONFIG);

// État global pour la gestion du refresh token
const tokenState = {
  isRefreshing: false,
  failedQueue: [] as QueueItem[],
};

// Gestionnaire de file d'attente
const processQueue = (
  error: Error | null,
  token: string | null = null
): void => {
  tokenState.failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  tokenState.failedQueue = [];
};

// Fonction de rafraîchissement du token
const refreshToken = async (): Promise<string | null> => {
  try {
    const currentRefreshToken = Cookies.get("refreshToken");
    if (!currentRefreshToken) {
      throw new Error("Pas de refresh token disponible");
    }

    const response: AxiosResponse = await axios.post(
      `${API_CONFIG.baseURL}/refresh-token`,
      { refreshToken: currentRefreshToken }
    );

    const { token, refreshToken: newRefreshToken } = response.data;

    // Mise à jour des cookies
    Cookies.set("token", token, { expires: TOKEN_EXPIRATION });
    Cookies.set("refreshToken", newRefreshToken, {
      expires: REFRESH_TOKEN_EXPIRATION,
    });

    return token;
  } catch (error) {
    console.error("Erreur lors du rafraîchissement du token:", error);
    handleAuthError();
    return null;
  }
};

// Gestionnaire d'erreur d'authentification
const handleAuthError = (): void => {
  Cookies.remove("token");
  Cookies.remove("refreshToken");
  window.location.href = "/login";
};

// Gestionnaire d'erreur HTTP
const handleHttpError = (status: number): void => {
  const errorMessages = {
    400: "Requête invalide. Veuillez vérifier vos données.",
    401: "Session expirée. Veuillez vous reconnecter.",
    403: "Accès interdit. Vous n'avez pas les autorisations nécessaires.",
    404: "Ressource non trouvée. Veuillez vérifier l'URL.",
    408: "Délai d'attente dépassé. Veuillez réessayer.",
    500: "Erreur serveur. Veuillez réessayer plus tard.",
    502: "Service temporairement indisponible.",
    503: "Service indisponible. Veuillez réessayer plus tard.",
  };

  const message =
    errorMessages[status as keyof typeof errorMessages] ||
    "Erreur inconnue. Veuillez réessayer plus tard.";

  toast.error(message);
};

// Intercepteur de requête
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Intercepteur de réponse
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Vérification des routes à exclure
    const currentPath = originalRequest.url;
    if (noRefreshRoutes.some((route) => currentPath?.includes(route))) {
      return Promise.reject(error);
    }

    // Gestion du refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (tokenState.isRefreshing) {
        return new Promise<unknown>((resolve, reject) => {
          tokenState.failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && typeof token === "string") {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axios(originalRequest);
            }
            return Promise.reject(new Error("Token invalide"));
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      tokenState.isRefreshing = true;

      try {
        const newToken = await refreshToken();
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return axios(originalRequest);
        }
        throw new Error("Échec du rafraîchissement du token");
      } catch (refreshError) {
        const error =
          refreshError instanceof Error
            ? refreshError
            : new Error("Erreur inconnue");
        processQueue(error, null);
        return Promise.reject(error);
      } finally {
        tokenState.isRefreshing = false;
      }
    }

    // Gestion des erreurs HTTP
    if (error.response?.status) {
      handleHttpError(error.response.status);
    } else {
      toast.error("Erreur réseau. Veuillez vérifier votre connexion.");
    }

    return Promise.reject(error);
  }
);

export default api;
