import React from 'react';
import { ListOrdered, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../common/Button';
import type { Project, ProcessStep } from '../../../types/setup';

interface ProcessStepsSetupProps {
  projects: Project[];
  steps: ProcessStep[];
  onUpdate: (steps: ProcessStep[]) => void;
}

export const ProcessStepsSetup: React.FC<ProcessStepsSetupProps> = ({
  projects,
  steps,
  onUpdate
}) => {
  const addStep = (projectId: string) => {
    onUpdate([
      ...steps,
      {
        id: Date.now().toString(),
        projectId,
        name: '',
        description: '',
        order: steps.filter(s => s.projectId === projectId).length + 1
      }
    ]);
  };

  const removeStep = (id: string) => {
    onUpdate(steps.filter(s => s.id !== id));
  };

  const updateStep = (id: string, field: keyof ProcessStep, value: string | number) => {
    onUpdate(
      steps.map(s => s.id === id ? { ...s, [field]: value } : s)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <ListOrdered className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">
          Configuration des étapes
        </h3>
      </div>

      {projects.map((project) => (
        <div key={project.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium text-gray-900">{project.name}</h4>
            <Button
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={() => addStep(project.id)}
            >
              Ajouter une étape
            </Button>
          </div>

          <div className="space-y-3">
            {steps
              .filter(step => step.projectId === project.id)
              .sort((a, b) => a.order - b.order)
              .map((step) => (
                <div
                  key={step.id}
                  className="p-4 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-grow space-y-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-500">
                          Étape {step.order}
                        </span>
                        <input
                          type="text"
                          value={step.name}
                          onChange={(e) => updateStep(step.id, 'name', e.target.value)}
                          placeholder="Nom de l'étape"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <textarea
                        value={step.description}
                        onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                        placeholder="Description de l'étape"
                        rows={2}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <button
                      onClick={() => removeStep(step.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};