import React from 'react';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../common/Button';
import type { Project } from '../../../types/setup';

interface ProjectSetupProps {
  projects: Project[];
  onUpdate: (projects: Project[]) => void;
}

export const ProjectSetup: React.FC<ProjectSetupProps> = ({ projects, onUpdate }) => {
  const addProject = () => {
    onUpdate([
      ...projects,
      { id: Date.now().toString(), name: '', description: '', type: 'standard' }
    ]);
  };

  const removeProject = (id: string) => {
    onUpdate(projects.filter(p => p.id !== id));
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    onUpdate(
      projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            Types de projets
          </h3>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={Plus}
          onClick={addProject}
        >
          Ajouter un type
        </Button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 bg-white rounded-lg border border-gray-200"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-grow space-y-4">
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  placeholder="Nom du type de projet"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                  placeholder="Description"
                  rows={2}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <select
                  value={project.type}
                  onChange={(e) => updateProject(project.id, 'type', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="standard">Standard</option>
                  <option value="complex">Complexe</option>
                  <option value="simple">Simple</option>
                </select>
              </div>
              <button
                onClick={() => removeProject(project.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};