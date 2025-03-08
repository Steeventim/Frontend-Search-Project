import api from "./api";
import type { ProcessStep, Process, Etape } from "../types/process";

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
      const { data } = await api.get("/typeprojet/your-type-projet-id/etapes");
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
        steps: [], // Initialiser avec un tableau vide ou le remplir si vous avez des étapes associées
        totalSteps: 21, // Remplacez par la logique appropriée pour obtenir le nombre total d'étapes
      }));
    } catch (error) {
      console.error("Error fetching processes:", error);
      throw error;
    }
  },

  getMyTasks: async (): Promise<ProcessStep[]> => {
    try {
      const { data } = await api.get("/etapes/all");
      return data.data.map(
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
          priority: "normal", // Remplacez par la logique appropriée pour obtenir la priorité
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
      const { data } = await api.get("/etapes/all");
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
        steps: [], // Initialiser avec un tableau vide ou le remplir si vous avez des étapes associées
        totalSteps: 21, // Remplacez par la logique appropriée pour obtenir le nombre total d'étapes
      }));
    } catch (error) {
      console.error("Error fetching processes:", error);
      throw error;
    }
  },

  approveStep: async (
    processId: string,
    stepId: string,
    comment: string,
    attachments: File[]
  ): Promise<void> => {
    return processService.handleStepAction(
      processId,
      stepId,
      comment,
      attachments,
      "approve"
    );
  },

  rejectStep: async (
    processId: string,
    stepId: string,
    comment: string,
    attachments: File[]
  ): Promise<void> => {
    return processService.handleStepAction(
      processId,
      stepId,
      comment,
      attachments,
      "reject"
    );
  },

  handleStepAction: async (
    processId: string,
    stepId: string,
    comment: string,
    attachments: File[],
    action: "approve" | "reject"
  ): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("comment", comment);
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      await api.post(
        `/processes/${processId}/steps/${stepId}/${action}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    } catch (error) {
      console.error(
        `Error ${action} step ${stepId} in process ${processId}:`,
        error
      );
      throw error;
    }
  },
};
