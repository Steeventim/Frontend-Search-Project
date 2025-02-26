import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  User, 
  Calendar, 
  MessageSquare,
  Paperclip,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ProcessComments } from './components/ProcessComments';
import { useProcessData } from '../../hooks/useProcessData';
import { useProcessActions } from './hooks/useProcessActions';
import { formatDateTime } from '../../utils/date';

export const ProcessDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { process, loading, error } = useProcessData(id);
  const { handleApprove, handleReject } = useProcessActions();
  const [comment, setComment] = React.useState('');
  const [attachments, setAttachments] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="text-center p-8 bg-red-50 rounded-lg">
      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <p className="text-red-600">{error}</p>
    </div>
  );

  if (!process) return (
    <div className="text-center p-8 bg-gray-50 rounded-lg">
      <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600">Processus non trouvé</p>
    </div>
  );

  const currentStep = process.steps[process.currentStep];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{process.title}</h1>
              <p className="mt-2 text-gray-600">{process.description}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              process.status === 'approved' ? 'bg-green-100 text-green-800' :
              process.status === 'rejected' ? 'bg-red-100 text-red-800' :
              process.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {process.status === 'approved' ? <CheckCircle2 className="h-4 w-4 mr-2" /> :
               process.status === 'rejected' ? <XCircle className="h-4 w-4 mr-2" /> :
               <Clock className="h-4 w-4 mr-2" />}
              {process.status.replace('_', ' ')}
            </span>
          </div>

          <div className="mt-6 flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {process.initiatedBy}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDateTime(process.createdAt)}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Étape {process.currentStep + 1}/{process.steps.length}
            </div>
          </div>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-between">
                {process.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center ${
                      index === process.currentStep
                        ? 'text-blue-600'
                        : step.status === 'approved'
                        ? 'text-green-600'
                        : step.status === 'rejected'
                        ? 'text-red-600'
                        : 'text-gray-400'
                    }`}
                  >
                    <div className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white ${
                      index === process.currentStep
                        ? 'border-blue-600'
                        : step.status === 'approved'
                        ? 'border-green-600'
                        : step.status === 'rejected'
                        ? 'border-red-600'
                        : 'border-gray-200'
                    }`}>
                      {step.status === 'approved' ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : step.status === 'rejected' ? (
                        <XCircle className="h-6 w-6" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium">{step.name}</p>
                    <p className="mt-1 text-xs">{step.assignedTo}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {currentStep && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Action requise</h2>
            <div className="space-y-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                rows={4}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              />

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  className="hidden"
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
                  <div className="mt-3 space-y-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                      >
                        <div className="flex items-center">
                          <Paperclip className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{file.name}</span>
                          <span className="text-xs text-gray-400 ml-2">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <XCircle className="h-4 w-4" />
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
                  onClick={() => handleApprove(currentStep, comment, attachments)}
                >
                  Approuver
                </Button>
                <Button
                  variant="danger"
                  icon={XCircle}
                  onClick={() => handleReject(currentStep, comment, attachments)}
                >
                  Rejeter
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Historique des commentaires</h2>
          <div className="space-y-4">
            {process.steps.flatMap(step => 
              step.comments.map(comment => (
                <div key={comment.id} className="flex space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {comment.userName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDateTime(comment.timestamp)}
                    </p>
                    <p className="mt-2 text-sm text-gray-700">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};