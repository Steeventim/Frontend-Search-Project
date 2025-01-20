import { useCallback } from 'react';
import type { ProcessStep } from '../../../types/process';

export const useProcessActions = () => {
  const handleApprove = useCallback(async (step: ProcessStep, comment: string, attachments: File[]) => {
    // TODO: Implement API call with file upload
    console.log('Approved:', step.id, comment, attachments);
  }, []);

  const handleReject = useCallback(async (step: ProcessStep, comment: string, attachments: File[]) => {
    // TODO: Implement API call with file upload
    console.log('Rejected:', step.id, comment, attachments);
  }, []);

  return {
    handleApprove,
    handleReject
  };
};