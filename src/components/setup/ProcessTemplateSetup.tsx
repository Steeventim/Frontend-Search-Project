import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { ProcessTemplate, ProcessStepTemplate } from '../../types/setup';

interface ProcessTemplateSetupProps {
  templates: ProcessTemplate[];
  departments: string[];
  roles: string[];
  onUpdate: (templates: ProcessTemplate[]) => void;
}

export const ProcessTemplateSetup: React.FC<ProcessTemplateSetupProps> = ({
  templates,
  departments,
  roles,
  onUpdate,
}) => {
  const addTemplate = () => {
    onUpdate([
      ...templates,
      {
        id: Date.now().toString(),
        name: '',
        description: '',
        steps: [],
      },
    ]);
  };

  const removeTemplate = (id: string) => {
    onUpdate(templates.filter((temp) => temp.id !== id));
  };

  const addStep = (templateId: string) => {
    onUpdate(
      templates.map((temp) =>
        temp.id === templateId
          ? {
              ...temp,
              steps: [
                ...temp.steps,
                {
                  id: Date.now().toString(),
                  name: '',
                  requiredRole: roles[0],
                  order: temp.steps.length + 1,
                },
              ],
            }
          : temp
      )
    );
  };

  const removeStep = (templateId: string, stepId: string) => {
    onUpdate(
      templates.map((temp) =>
        temp.id === templateId
          ? {
              ...temp,
              steps: temp.steps.filter((step) => step.id !== stepId),
            }
          : temp
      )
    );
  };

  const updateTemplate = (
    id: string,
    field: keyof ProcessTemplate,
    value: string
  ) => {
    onUpdate(
      templates.map((temp) =>
        temp.id === id ? { ...temp, [field]: value } : temp
      )
    );
  };

  const updateStep = (
    templateId: string,
    stepId: string,
    field: keyof ProcessStepTemplate,
    value: string | number
  ) => {
    onUpdate(
      templates.map((temp) =>
        temp.id === templateId
          ? {
              ...temp,
              steps: temp.steps.map((step) =>
                step.id === stepId ? { ...step, [field]: value } : step
              ),
            }
          : temp
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          Modèles de processus
        </h3>
        <button
          type="button"
          onClick={addTemplate}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </button>
      </div>

      <div className="space-y-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="flex-grow space-y-4">
                  <input
                    type="text"
                    value={template.name}
                    onChange={(e) =>
                      updateTemplate(template.id, 'name', e.target.value)
                    }
                    placeholder="Nom du processus"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <textarea
                    value={template.description}
                    onChange={(e) =>
                      updateTemplate(template.id, 'description', e.target.value)
                    }
                    placeholder="Description"
                    rows={2}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeTemplate(template.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Étapes</h4>
                  <button
                    type="button"
                    onClick={() => addStep(template.id)}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter une étape
                  </button>
                </div>

                <div className="space-y-4">
                  {template.steps.map((step) => (
                    <div
                      key={step.id}
                      className="flex items-start space-x-4 p-4 bg-gray-50 rounded-md"
                    >
                      <div className="flex-grow grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={step.name}
                          onChange={(e) =>
                            updateStep(
                              template.id,
                              step.id,
                              'name',
                              e.target.value
                            )
                          }
                          placeholder="Nom de l'étape"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        <select
                          value={step.requiredRole}
                          onChange={(e) =>
                            updateStep(
                              template.id,
                              step.id,
                              'requiredRole',
                              e.target.value
                            )
                          }
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          {roles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeStep(template.id, step.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};