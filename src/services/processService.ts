import api from "./api";
import type { ProcessStep, Process, Etape } from "../types/process";
import Cookies from "js-cookie";

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
      const { data } = await api.get(
        `/documents/${documentName}/${searchTerm}`,
        {
          params,
          responseType: "blob",
        }
      );
      return data;
    } catch (error) {
      console.error("Error searching documents:", error);
      throw error;
    }
  },

  getProcesses: async (): Promise<Process[]> => {
    try {
      const roleName = Cookies.get("roleName");
      const { data } = await api.get(`/etapes/role/${roleName}`);

      // Filtrer les données selon hasTransfer et sequenceNumber
      const filteredData = data.data.filter(
        (task: { hasTransfer: boolean; sequenceNumber: number }) =>
          task.hasTransfer || (!task.hasTransfer && task.sequenceNumber === 1)
      );

      return filteredData.map((etape: Etape) => ({
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
        totalSteps: data.totalEtapes,
      }));
    } catch (error) {
      console.error("Error fetching processes:", error);
      throw error;
    }
  },

  getMyTasks: async (): Promise<ProcessStep[]> => {
    try {
      const roleName = Cookies.get("roleName");
      const { data } = await api.get(`/etapes/role/${roleName}`);

      // Filtrer les données selon hasTransfer et sequenceNumber
      const filteredData = data.data.filter(
        (task: { hasTransfer: boolean; sequenceNumber: number }) =>
          task.hasTransfer || (!task.hasTransfer && task.sequenceNumber === 1)
      );

      return filteredData.map(
        (task: {
          idEtape: string;
          LibelleEtape: string;
          Description: string;
          createdAt: string;
          updatedAt: string;
        }) => ({
          id: task.idEtape,
          processName: task.LibelleEtape,
          stepName: task.Description,
          status: "pending",
          priority: "normal",
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        })
      );
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  getMyProcesses: async (): Promise<Process[]> => {
    try {
      const roleName = Cookies.get("roleName");
      const { data } = await api.get(`/etapes/role/${roleName}`);

      // Supprimer le filtre sur hasTransfer et sequenceNumber
      return data.data.map((etape: Etape) => ({
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
        totalSteps: data.totalEtapes,
      }));
    } catch (error) {
      console.error("Error fetching processes:", error);
      throw error;
    }
  },
};
