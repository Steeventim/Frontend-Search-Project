import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Calendar,
  User,
} from "lucide-react";
import { formatDate } from "../../utils/date";
// import { ROUTES } from "../../constants/routes";
import type { Process } from "../../types/process";

interface ProcessListProps {
  processes: Process[];
  onProcessSelect: (process: Process) => void;
}

export const ProcessList: React.FC<ProcessListProps> = ({
  processes,
  onProcessSelect,
}) => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  if (!processes.length)
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Aucun processus en cours</p>
      </div>
    );

  const filterAndSortProcesses = () => {
    let filtered = processes;
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }
    return filtered.sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      in_progress: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      approved: <CheckCircle2 className="h-4 w-4" />,
      rejected: <XCircle className="h-4 w-4" />,
      in_progress: <AlertCircle className="h-4 w-4" />,
    };
    return icons[status] || <Clock className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Suivi des processus
        </h2>
        <div className="flex space-x-2">
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="in_progress">En cours</option>
            <option value="approved">Approuvés</option>
            <option value="rejected">Rejetés</option>
          </select>
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Plus récents</option>
            <option value="oldest">Plus anciens</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filterAndSortProcesses().map((process) => (
          <div
            key={process.id}
            onClick={() => onProcessSelect(process)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {process.title}
                  </h3>
                  <p className="text-sm text-gray-600">{process.description}</p>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    process.status
                  )}`}
                >
                  {getStatusIcon(process.status)}
                  <span className="ml-2 capitalize">
                    {process.status.replace("_", " ")}
                  </span>
                </span>
              </div>

              <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(process.createdAt)}
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {process.initiatedBy}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Étape {process.currentStep + 1}/{process.steps.length}
                </div>
              </div>

              <div className="mt-4">
                <div className="relative">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                    <div
                      style={{
                        width: `${
                          ((process.currentStep + 1) / process.steps.length) *
                          100
                        }%`,
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {process.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`h-8 w-8 rounded-full border-2 border-white flex items-center justify-center ${
                        index === process.currentStep
                          ? "bg-blue-100 text-blue-600"
                          : step.status === "approved"
                          ? "bg-green-100 text-green-600"
                          : step.status === "rejected"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {step.status === "approved" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : step.status === "rejected" ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        <span className="text-xs font-medium">{index + 1}</span>
                      )}
                    </div>
                  ))}
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
