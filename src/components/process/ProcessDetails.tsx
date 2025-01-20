import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../common/Card';
import { ProcessStepCard } from './ProcessStepCard';
import { ProcessComments } from './components/ProcessComments';
import { ProcessStepStatus } from './components/ProcessStepStatus';
import { useProcessData } from '../../hooks/useProcessData';
import { useProcessActions } from './hooks/useProcessActions';
import { formatDateTime } from '../../utils/date';

export const ProcessDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { process, loading, error } = useProcessData(id);
  const { handleApprove, handleReject } = useProcessActions();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!process) return <div>Processus non trouvé</div>;

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{process.title}</h2>
          <p className="mt-1 text-gray-500">{process.description}</p>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span>Initié par {process.initiatedBy}</span>
            <span className="mx-2">•</span>
            <span>{formatDateTime(process.createdAt)}</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Progression du processus
          </h3>
          <div className="space-y-4">
            {process.steps.map((step, index) => (
              <ProcessStepCard
                key={step.id}
                step={step}
                isCurrentStep={index === process.currentStep}
                onApprove={(comment, attachments) => handleApprove(step, comment, attachments)}
                onReject={(comment, attachments) => handleReject(step, comment, attachments)}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};