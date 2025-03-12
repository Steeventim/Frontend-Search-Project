// Types pour les tâches à traiter
export interface DashboardTask {
  id: string;
  processId: string;
  processName: string;
  stepName: string;
  deadline: string;
  status: "pending" | "in_progress" | "approved" | "rejected";
  priority: "low" | "normal" | "high" | "urgent";
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

// Types pour les processus en cours
export interface DashboardProcess {
  id: string;
  title: string;
  description: string;
  type: string;
  currentStep: number;
  totalSteps: number;
  status: "pending" | "in_progress" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  initiatedBy: {
    id: string;
    name: string;
  };
  steps: Array<{
    id: string;
    name: string;
    order: number;
    status: "pending" | "in_progress" | "approved" | "rejected";
    assignedTo: {
      id: string;
      name: string;
    };
  }>;
}

// Type pour les statistiques rapides
export interface DashboardStats {
  tasksCount: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
  processesCount: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
  deadlines: {
    upcoming: number;
    overdue: number;
  };
}

// Interface principale pour les données du dashboard
export interface DashboardData {
  tasks: DashboardTask[];
  processes: DashboardProcess[];
  stats: DashboardStats;
}

// Interface pour les endpoints API
export interface DashboardAPI {
  // Récupère toutes les données du dashboard
  getDashboardData: () => Promise<DashboardData>;

  // Récupère uniquement les tâches
  getTasks: () => Promise<DashboardTask[]>;

  // Récupère uniquement les processus
  getProcesses: () => Promise<DashboardProcess[]>;

  // Récupère uniquement les statistiques
  getStats: () => Promise<DashboardStats>;
}
