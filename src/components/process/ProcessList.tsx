import React from "react";
import { Clock, AlertCircle, ChevronRight, Calendar } from "lucide-react";
import { formatDate } from "../../utils/date";

interface Process {
  idEtape: string;
  LibelleEtape: string;
  Description: string;
  Validation: string;
  sequenceNumber: number;
  createdAt: string;
  updatedAt: string;
}

interface ProcessListProps {
  processes: Process[];
}

export const ProcessList: React.FC<ProcessListProps> = ({ processes }) => {
  if (!processes.length)
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Aucun processus en cours</p>
      </div>
    );

  const trierProcessus = () => {
    return [...processusExemple].sort((a, b) =>
      ordreTri === "recent"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Suivi des processus
          </h2>
          <select
            className="rounded-md border border-gray-300 p-2 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={ordreTri}
            onChange={(e) => setOrdreTri(e.target.value)}
          >
            <option value="recent">Plus récents</option>
            <option value="ancien">Plus anciens</option>
          </select>
        </div>
        <div className="grid gap-4">
          {trierProcessus().map((proc) => (
            <div
              key={proc.idEtape}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {proc.LibelleEtape}
                    </h3>
                    <p className="text-sm text-gray-600">{proc.Description}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(proc.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Séquence {proc.sequenceNumber}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-700">{proc.Validation}</div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
