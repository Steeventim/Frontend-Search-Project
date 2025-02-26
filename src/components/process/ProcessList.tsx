import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle, AlertCircle, ChevronRight, Calendar, User } from 'lucide-react';
import { Card } from '../common/Card';
import { ProcessStepStatus } from './components/ProcessStepStatus';
import { useProcessData } from '../../hooks/useProcessData';
import { formatDate } from '../../utils/date';
import { ROUTES } from '../../constants/routes';

export const ProcessList: React.FC = () => {
  const navigate = useNavigate();
  const { process: processes, loading, error } = useProcessData();

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center p-8 bg-red-50 rounded-lg">
      <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <p className="text-red-600">{error}</p>
    </div>
  );

  if (!processes?.length) return (
    <div className="text-center p-8 bg-gray-50 rounded-lg">
      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600">Aucun processus en cours</p>
    </div>
  );

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      in_progress: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      approved: <CheckCircle2 className="h-4 w-4" />,
      rejected: <XCircle className="h-4 w-4" />,
      in_progress: <AlertCircle className="h-4 w-4" />
    };
    return icons[status] || <Clock className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Suivi des processus</h2>
        <div className="flex space-x-2">
          <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="in_progress">En cours</option>
            <option value="approved">Approuvés</option>
            <option value="rejected">Rejetés</option>
          </select>
          <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option value="newest">Plus récents</option>
            <option value="oldest">Plus anciens</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {processes.map((process) => (
          <div
            key={process.id}
            onClick={() => navigate(`${ROUTES.USER.PROCESSES}/${process.id}`)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {process.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {process.description}
                  </p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(process.status)}`}>
                  {getStatusIcon(process.status)}
                  <span className="ml-2 capitalize">{process.status.replace('_', ' ')}</span>
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
                        width: `${((process.currentStep + 1) / process.steps.length) * 100}%`
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
                          ? 'bg-blue-100 text-blue-600'
                          : step.status === 'approved'
                          ? 'bg-green-100 text-green-600'
                          : step.status === 'rejected'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {step.status === 'approved' ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : step.status === 'rejected' ? (
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