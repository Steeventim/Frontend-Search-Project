import React from 'react';
import { CheckCircle2, XCircle, MessageSquare } from 'lucide-react';
import type { Process, Comment } from '../types';

interface ProcessDetailsProps {
  process: Process;
  onApprove: (stepId: string, comment: string) => void;
  onReject: (stepId: string, comment: string) => void;
}

export const ProcessDetails: React.FC<ProcessDetailsProps> = ({
  process,
  onApprove,
  onReject,
}) => {
  const [comment, setComment] = React.useState('');
  const currentStep = process.steps[process.currentStep];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900">{process.title}</h2>
        <p className="mt-2 text-gray-600">{process.description}</p>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Progression</h3>
          <div className="space-y-4">
            {process.steps.map((step, index) => (
              <div
                key={step.id}
                className={`p-4 rounded-lg border ${
                  index === process.currentStep
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
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
                  <div className="mt-4 space-y-2">
                    {step.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="text-sm bg-gray-50 p-3 rounded"
                      >
                        <p className="font-medium text-gray-900">
                          {comment.userName}
                        </p>
                        <p className="text-gray-600">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {currentStep && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Action requise
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Commentaire
                </label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => onApprove(currentStep.id, comment)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approuver
                </button>
                <button
                  onClick={() => onReject(currentStep.id, comment)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Rejeter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}