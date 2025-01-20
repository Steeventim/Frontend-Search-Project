import React from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { Process } from '../types';

const statusIcons = {
  pending: <Clock className="w-5 h-5 text-yellow-500" />,
  approved: <CheckCircle2 className="w-5 h-5 text-green-500" />,
  rejected: <XCircle className="w-5 h-5 text-red-500" />,
  in_progress: <AlertCircle className="w-5 h-5 text-blue-500" />
};

interface ProcessListProps {
  processes: Process[];
  onProcessSelect: (process: Process) => void;
}

export const ProcessList: React.FC<ProcessListProps> = ({ processes, onProcessSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Processus en cours</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {processes.map((process) => (
          <div
            key={process.id}
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onProcessSelect(process)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{process.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{process.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                {statusIcons[process.status]}
                <span className="text-sm text-gray-500">
                  Étape {process.currentStep}/{process.steps.length}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}