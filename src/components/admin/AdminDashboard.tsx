import React, { useState, ReactNode } from "react";
import {
  BarChart3,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>{children}</div>
  );
};

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("week");

  // Extended stats data
  const extendedStats = {
    totalUsers: 24,
    activeUsers: 18,
    totalProcesses: 23,
    pendingProcesses: 7,
    completedProcesses: 25,
    averageCompletionTime: 2.5,
    userGrowth: 12.5,
    processGrowth: 8.3,
  };

  // Recent activity data
  const recentActivity = [
    {
      id: "1",
      type: "process_created",
      user: "Marie Madeleine",
      process: "Projet Alpha - Design Phase",
      timestamp: "2023-06-15T10:30:00",
      status: "En cours",
    },
    {
      id: "2",
      type: "process_completed",
      user: "Thomas Ngono",
      process: "Projet Beta - Development",
      timestamp: "2023-06-15T09:45:00",
      status: "Terminé",
    },
    {
      id: "3",
      type: "user_added",
      user: "Admin",
      process: "N/A",
      timestamp: "2023-06-15T09:30:00",
    },
    {
      id: "4",
      type: "process_rejected",
      user: "Tamo bertrand",
      process: "Projet Gamma - Testing",
      timestamp: "2023-06-15T08:15:00",
      status: "Rejeté",
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "process_created":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "process_completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "process_rejected":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "user_added":
        return <Users className="h-5 w-5 text-purple-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-200";

    switch (status.toLowerCase()) {
      case "en cours":
        return "bg-blue-100 text-blue-800";
      case "terminé":
        return "bg-green-100 text-green-800";
      case "en attente":
        return "bg-yellow-100 text-yellow-800";
      case "rejeté":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tableau de bord administrateur
              </h1>
              <p className="text-gray-500">
                Vue d'ensemble de l'activité de la plateforme
              </p>
            </div>
            <div className="flex items-center mt-4 sm:mt-0">
              <div className="relative">
                <select
                  className="w-full sm:w-40 border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="day">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="quarter">Ce trimestre</option>
                  <option value="year">Cette année</option>
                </select>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* User Statistics */}
            <Card className="p-4">
              <div className="pb-2">
                <p className="text-sm font-medium text-gray-500">
                  Utilisateurs
                </p>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold">
                    {extendedStats.totalUsers}
                  </div>
                  <p className="text-xs text-gray-500">
                    {extendedStats.activeUsers} actifs
                  </p>
                </div>
                <div className="flex items-center text-green-500">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">
                    {extendedStats.userGrowth}%
                  </span>
                </div>
              </div>
            </Card>

            {/* Process Statistics */}
            <Card className="p-4">
              <div className="pb-2">
                <p className="text-sm font-medium text-gray-500">Processus</p>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold">
                    {extendedStats.totalProcesses}
                  </div>
                  <p className="text-xs text-gray-500">
                    {extendedStats.pendingProcesses} en attente
                  </p>
                </div>
                <div className="flex items-center text-green-500">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">
                    {extendedStats.processGrowth}%
                  </span>
                </div>
              </div>
            </Card>

            {/* Completion Rate */}
            <Card className="p-4">
              <div className="pb-2">
                <p className="text-sm font-medium text-gray-500">
                  Taux de complétion
                </p>
              </div>
              <div className="flex flex-col">
                <div className="text-2xl font-bold">
                  {Math.round(
                    (extendedStats.completedProcesses /
                      extendedStats.totalProcesses) *
                      100
                  )}
                  %
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (extendedStats.completedProcesses /
                          extendedStats.totalProcesses) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {extendedStats.completedProcesses} terminés sur{" "}
                  {extendedStats.totalProcesses}
                </p>
              </div>
            </Card>

            {/* Average Time */}
            <Card className="p-4">
              <div className="pb-2">
                <p className="text-sm font-medium text-gray-500">Temps moyen</p>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold">
                    {extendedStats.averageCompletionTime} jours
                  </div>
                  <p className="text-xs text-gray-500">
                    Durée moyenne de traitement
                  </p>
                </div>
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Process Evolution Chart */}
            <Card className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium">Évolution des processus</h3>
                <p className="text-sm text-gray-500">
                  Nombre de processus créés et terminés
                </p>
              </div>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                  <p>Graphique d'évolution des processus</p>
                </div>
              </div>
            </Card>

            {/* Process Distribution Chart */}
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium">
                    Répartition des processus
                  </h3>
                  <p className="text-sm text-gray-500">
                    Distribution par statut
                  </p>
                </div>
                <div className="inline-flex rounded-md shadow-sm">
                  <button className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-l-md">
                    Par statut
                  </button>
                  <button className="px-2 py-1 text-xs font-medium text-gray-700 bg-white rounded-r-md border-l">
                    Par département
                  </button>
                </div>
              </div>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p>Graphique de répartition des processus</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activity Feed */}
          <Card className="p-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Activité récente</h3>
              <p className="text-sm text-gray-500">
                Dernières actions sur la plateforme
              </p>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.user}
                      {activity.type === "process_created" &&
                        " a créé un nouveau processus"}
                      {activity.type === "process_completed" &&
                        " a terminé un processus"}
                      {activity.type === "process_rejected" &&
                        " a rejeté un processus"}
                      {activity.type === "user_added" &&
                        " a ajouté un nouvel utilisateur"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.process !== "N/A" &&
                        `Processus: ${activity.process}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                  {activity.status && (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        activity.status
                      )}`}
                    >
                      {activity.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4">
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                Voir toute l'activité
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
