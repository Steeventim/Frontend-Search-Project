import api from "./api";
import type { ProcessStep, Process, Etape } from "../types/process";
import Cookies from "js-cookie";
import { AxiosError } from "axios";

// Interface pour la réponse de l'API /etapes/role
interface EtapesResponse {
  success: boolean;
  data: Etape[];
  totalEtapes: number;
}

// Cache en mémoire (simple Map pour cet exemple)
const cache = new Map<string, { data: EtapesResponse; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fonction utilitaire pour gérer les réessais
const withRetry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries) throw error;
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status !== 429 && status !== 503) throw error; // Réessayer uniquement pour 429/503
      }
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }
  throw new Error("Max retries reached");
};

// Fonction centralisée pour récupérer les étapes par rôle
const fetchEtapesByRole = async (roleName: string): Promise<EtapesResponse> => {
  if (!roleName) {
    throw new Error("Role name is required");
  }

  const cacheKey = `/etapes/role/${roleName}`;
  const cached = cache.get(cacheKey);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const { data } = await withRetry(() =>
      api.get<EtapesResponse>(cacheKey, {
        timeout: 10000, // 10 secondes
        headers: {
          "Accept-Encoding": "gzip, deflate",
        },
      })
    );

    if (!data.success) {
      throw new Error("API returned unsuccessful response");
    }

    cache.set(cacheKey, { data, timestamp: now });
    return data;
  } catch (error) {
    const err = error instanceof AxiosError ? error : new Error(String(error));
    console.error(`Error fetching etapes for role ${roleName}:`, err);
    throw new Error(
      err instanceof AxiosError
        ? `Failed to fetch etapes: ${
            err.response?.data?.message || err.message
          }`
        : `Failed to fetch etapes: ${err.message}`
    );
  }
};

// Fonctions utilitaires pour le mappage
const mapEtapeToProcess = (etape: Etape, totalEtapes: number): Process => ({
  id: etape.idEtape,
  name: etape.LibelleEtape,
  title: etape.LibelleEtape,
  description: etape.Description,
  currentStep: etape.sequenceNumber,
  status: "pending",
  createdAt: new Date(etape.createdAt),
  updatedAt: new Date(etape.updatedAt),
  initiatedBy: "Inconnu",
  steps: [],
  totalSteps: totalEtapes,
});

const mapEtapeToProcessStep = (etape: Etape): ProcessStep => ({
  id: etape.idEtape,
  processName: etape.LibelleEtape,
  stepName: etape.Description,
  status: "pending",
  priority: "normal",
  createdAt: new Date(etape.createdAt),
  updatedAt: new Date(etape.updatedAt),
});

export const processService = {
  searchDocuments: async (
    documentName: string,
    searchTerm: string,
    etapeName?: string
  ): Promise<Blob> => {
    if (!documentName || !searchTerm) {
      throw new Error("Document name and search term are required");
    }

    try {
      const params: Record<string, string> = etapeName ? { etapeName } : {};
      const { data } = await withRetry(() =>
        api.get(`/documents/${documentName}/${searchTerm}`, {
          params,
          responseType: "blob",
          timeout: 10000,
          headers: {
            "Accept-Encoding": "gzip, deflate",
          },
        })
      );
      return data;
    } catch (error) {
      const err =
        error instanceof AxiosError ? error : new Error(String(error));
      console.error("Error searching documents:", err);
      throw new Error(
        err instanceof AxiosError
          ? `Failed to search documents: ${
              err.response?.data?.message || err.message
            }`
          : `Failed to search documents: ${err.message}`
      );
    }
  },

  getProcesses: async (): Promise<Process[]> => {
    const roleName = Cookies.get("roleUser");
    if (!roleName) {
      throw new Error("User role not found in cookies");
    }

    try {
      const response = await fetchEtapesByRole(roleName);
      const filteredData = response.data.filter(
        (task) =>
          task.hasTransfer || (!task.hasTransfer && task.sequenceNumber === 1)
      );
      return filteredData.map((etape) =>
        mapEtapeToProcess(etape, response.totalEtapes)
      );
    } catch (error) {
      console.error("Error fetching processes:", error);
      throw error;
    }
  },

  getMyTasks: async (): Promise<ProcessStep[]> => {
    const roleName = Cookies.get("roleUser");
    if (!roleName) {
      throw new Error("User role not found in cookies");
    }

    try {
      const response = await fetchEtapesByRole(roleName);
      const filteredData = response.data.filter(
        (task) =>
          task.hasTransfer || (!task.hasTransfer && task.sequenceNumber === 1)
      );
      return filteredData.map(mapEtapeToProcessStep);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  getMyProcesses: async (): Promise<Process[]> => {
    const roleName = Cookies.get("roleUser");
    if (!roleName) {
      throw new Error("User role not found in cookies");
    }

    try {
      const response = await fetchEtapesByRole(roleName);
      return response.data.map((etape) =>
        mapEtapeToProcess(etape, response.totalEtapes)
      );
    } catch (error) {
      console.error("Error fetching processes:", error);
      throw error;
    }
  },
};
