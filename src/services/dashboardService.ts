import api from "./api";
import type {
  DashboardData,
  DashboardTask,
  DashboardProcess,
  DashboardStats,
} from "../types/dashboard";

export const dashboardService = {
  // Récupère toutes les données du dashboard
  getDashboardData: async (): Promise<DashboardData> => {
    const { data } = await api.get("/dashboard");
    return data;
  },

  // Récupère uniquement les tâches
  getTasks: async (): Promise<DashboardTask[]> => {
    const { data } = await api.get("/dashboard/tasks");
    return data;
  },

  // Récupère uniquement les processus
  getProcesses: async (): Promise<DashboardProcess[]> => {
    const { data } = await api.get("/dashboard/processes");
    return data;
  },

  // Récupère uniquement les statistiques
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get("/dashboard/stats");
    return data;
  },

  // Marque une tâche comme vue
  markTaskViewed: async (taskId: string): Promise<void> => {
    await api.post(`/dashboard/tasks/${taskId}/viewed`);
  },

  // Récupère les détails d'une tâche spécifique
  getTaskDetails: async (taskId: string): Promise<DashboardTask> => {
    const { data } = await api.get(`/dashboard/tasks/${taskId}`);
    return data;
  },

  // Récupère les détails d'un processus spécifique
  getProcessDetails: async (processId: string): Promise<DashboardProcess> => {
    const { data } = await api.get(`/dashboard/processes/${processId}`);
    return data;
  },
};
