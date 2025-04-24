import React, { useEffect, useState } from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  ChevronRight,
  Search,
} from "lucide-react";
import { Card } from "../common/Card";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { processService } from "../../services/processService";
import type { ProcessStep, Process } from "../../types/process";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [myTasks, setMyTasks] = useState<ProcessStep[]>([]);
  const [myProcesses, setMyProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const [processesError, setProcessesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tasks, processes] = await Promise.all([
          processService.getMyTasks(),
          processService.getMyProcesses(),
        ]);
        console.log("Fetched tasks:", tasks);
        console.log("Fetched processes:", processes);
        setMyTasks(tasks);
        setMyProcesses(processes);
        setTasksError(null);
        setProcessesError(null);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        const errMsg = error instanceof Error ? error.message : String(error);
        if (errMsg.includes("tasks")) {
          setTasksError("Erreur lors de la récupération des tâches.");
        } else if (errMsg.includes("processes")) {
          setProcessesError("Erreur lors de la récupération des processus.");
        } else {
          setTasksError("Erreur lors de la récupération des données.");
          setProcessesError("Erreur lors de la récupération des données.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTaskClick = (taskId: string) => {
    const process = myProcesses.find((p) => p.id === taskId);
    if (process) {
      navigate(`${ROUTES.USER.PROCESSES}/${taskId}`, { state: { process } });
    } else {
      console.warn(`Process with id ${taskId} not found`);
    }
  };

  const getStatusIcon = (status: ProcessStep["status"]) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getPriorityBadgeColor = (priority: ProcessStep["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "normal":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Mon tableau de bord
        </h1>
      </div>

      {(tasksError || processesError) && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-600">
          {tasksError || processesError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tâches à traiter */}
        <Card>
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Mes tâches à traiter
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            ) : (
              myTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleTaskClick(task.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {task.processName}
                        </h4>
                        <p className="text-sm text-gray-500">{task.stepName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeColor(
                          task.priority
                        )}`}
                      >
                        {task.priority.charAt(0).toUpperCase() +
                          task.priority.slice(1)}
                      </span>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))
            )}
            {myTasks.length === 0 && !loading && (
              <div className="p-4 text-center text-gray-500">
                Aucune tâche en attente
              </div>
            )}
          </div>
        </Card>

        {/* Mes processus en cours */}
        <Card>
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Mes processus en cours
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            ) : (
              myProcesses.map((process) => (
                <div
                  key={process.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() =>
                    navigate(`#`, {
                      state: { process },
                    })
                  }
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {process.title}
                      </h4>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1.5" />
                        Étape {process.currentStep}/{process.totalSteps}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="mt-2">
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                        <div
                          style={{
                            width: `${
                              (process.currentStep / process.totalSteps) * 100
                            }%`,
                          }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            {myProcesses.length === 0 && !loading && (
              <div className="p-4 text-center text-gray-500">
                Aucun processus en cours
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900">Actions rapides</h3>
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => navigate(ROUTES.USER.NEW_PROCESS || "#")} // Remplacer par une route valide
              className="relative rounded-lg p-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 flex-1 mr-4"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Nouveau Processus
                  </p>
                  <p className="text-sm text-gray-500">
                    Créer un nouveau processus
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate(ROUTES.USER.SEARCH)}
              className="relative rounded-lg p-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 flex-1 ml-4"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Rechercher
                  </p>
                  <p className="text-sm text-gray-500">
                    Consulter les Archives
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
