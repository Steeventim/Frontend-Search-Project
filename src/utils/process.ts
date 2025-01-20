import type { Process, ProcessStatus } from '../types/process';

export const getProcessStatusColor = (status: ProcessStatus): string => {
  const colors = {
    pending: 'yellow',
    approved: 'green',
    rejected: 'red',
    in_progress: 'blue'
  };
  return colors[status];
};

export const getProcessProgress = (process: Process): number => {
  const completedSteps = process.steps.filter(
    step => step.status === 'approved'
  ).length;
  return Math.round((completedSteps / process.steps.length) * 100);
};