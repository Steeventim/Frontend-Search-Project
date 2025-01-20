import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { ProcessStepStatus } from './components/ProcessStepStatus';
import { useProcessData } from '../../hooks/useProcessData';
import { formatDate } from '../../utils/date';
import { ROUTES } from '../../constants/routes';

export const ProcessList: React.FC = () => {
  const navigate = useNavigate();
  const { process: processes, loading, error } = useProcessData();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!processes?.length) return <div>Aucun processus trouvé</div>;

  return (
    <Card title="Processus en cours">
      <div className="divide-y divide-gray-200">
        {processes.map((process) => (
          <div
            key={process.id}
            onClick={() => navigate(`${ROUTES.USER.PROCESSES}/${process.id}`)}
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {process.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {process.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Initié par {process.initiatedBy} le {formatDate(process.createdAt)}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <ProcessStepStatus status={process.status} />
                <span className="text-sm text-gray-500">
                  Étape {process.currentStep + 1}/{process.steps.length}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};