import React, { useState } from 'react';
import { CheckCircle2, XCircle, MessageSquare, Paperclip, X } from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import type { ProcessStep, Attachment } from '../../types/process';

interface ProcessStepCardProps {
  step: ProcessStep;
  isCurrentStep: boolean;
  onApprove: (comment: string, attachments: File[]) => void;
  onReject: (comment: string, attachments: File[]) => void;
}

export const ProcessStepCard: React.FC<ProcessStepCardProps> = ({
  step,
  isCurrentStep,
  onApprove,
  onReject,
}) => {
  const [comment, setComment] = React.useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleAction = (action: 'approve' | 'reject') => {
    if (action === 'approve') {
      onApprove(comment, attachments);
    } else {
      onReject(comment, attachments);
    }
    setComment('');
    setAttachments([]);
  };

  return (
    <Card
      className={`${
        isCurrentStep ? 'border-2 border-blue-500' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-medium text-gray-900">{step.name}</h4>
          <p className="text-sm text-gray-500">
            Assigné à: {step.assignedTo}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {step.status === 'approved' && (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          )}
          {step.status === 'rejected' && (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
        </div>
      </div>

      {step.comments.length > 0 && (
        <div className="space-y-2 mb-4">
          {step.comments.map((comment) => (
            <div
              key={comment.id}
              className="text-sm bg-gray-50 p-3 rounded"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{comment.userName}</span>
                <span className="text-gray-500 text-xs">
                  {new Date(comment.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-600 mt-1">{comment.text}</p>
              {comment.attachments && comment.attachments.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium text-gray-500">Pièces jointes:</p>
                  {comment.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Paperclip className="w-4 h-4 mr-1" />
                      {attachment.fileName}
                      <span className="text-xs text-gray-500 ml-2">
                        ({(attachment.fileSize / 1024).toFixed(1)} KB)
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isCurrentStep && (
        <div className="space-y-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ajouter un commentaire..."
            rows={3}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />

          <div className="space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
            <Button
              variant="secondary"
              size="sm"
              icon={Paperclip}
              onClick={() => fileInputRef.current?.click()}
            >
              Ajouter des fichiers
            </Button>

            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <Paperclip className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <Button
              variant="primary"
              icon={CheckCircle2}
              onClick={() => handleAction('approve')}
            >
              Approuver
            </Button>
            <Button
              variant="danger"
              icon={XCircle}
              onClick={() => handleAction('reject')}
            >
              Rejeter
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};