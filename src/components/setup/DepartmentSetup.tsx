import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Department } from '../../types/setup';

interface DepartmentSetupProps {
  departments: Department[];
  onUpdate: (departments: Department[]) => void;
}

export const DepartmentSetup: React.FC<DepartmentSetupProps> = ({
  departments,
  onUpdate,
}) => {
  const addDepartment = () => {
    onUpdate([
      ...departments,
      { id: Date.now().toString(), name: '', description: '' },
    ]);
  };

  const removeDepartment = (id: string) => {
    onUpdate(departments.filter((dept) => dept.id !== id));
  };

  const updateDepartment = (id: string, field: keyof Department, value: string) => {
    onUpdate(
      departments.map((dept) =>
        dept.id === id ? { ...dept, [field]: value } : dept
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Départements</h3>
        <button
          type="button"
          onClick={addDepartment}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </button>
      </div>

      <div className="space-y-4">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow"
          >
            <div className="flex-grow space-y-4">
              <input
                type="text"
                value={dept.name}
                onChange={(e) => updateDepartment(dept.id, 'name', e.target.value)}
                placeholder="Nom du département"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <textarea
                value={dept.description}
                onChange={(e) =>
                  updateDepartment(dept.id, 'description', e.target.value)
                }
                placeholder="Description"
                rows={2}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => removeDepartment(dept.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};