import React from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import type { ProcessStatus } from '../../../types/process';

interface ProcessStepStatusProps {
  status: ProcessStatus;
}

export const ProcessStepStatus: React.FC<ProcessStepStatusProps> = ({ status }) => {
  const statusConfig = {
    pending: { icon: Clock, color: 'text-yellow-500' },
    approved: { icon: CheckCircle2, color: 'text-green-500' },
    rejected: { icon: XCircle, color: 'text-red-500' },
    in_progress: { icon: Clock, color: 'text-blue-500' }
  };

  const { icon: Icon, color } = statusConfig[status];

  return <Icon className={`h-5 w-5 ${color}`} />;
};