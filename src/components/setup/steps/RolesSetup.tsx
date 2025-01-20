import React from 'react';
import { Shield, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../common/Button';
import type { Role } from '../../../types/setup';

interface RolesSetupProps {
  roles: Role[];
  onUpdate: (roles: Role[]) => void;
}

export const RolesSetup: React.FC<RolesSetupProps> = ({ roles, onUpdate }) => {
  const addRole = () => {
    onUpdate([
      ...roles,
      {
        id: Date.now().toString(),
        name: '',
        description: '',
        permissions: []
      }
    ]);
  };

  const removeRole = (id: string) => {
    onUpdate(roles.filter(r => r.id !== id));
  };

  const updateRole = (id: string, field: keyof Role, value: string | string[]) => {
    onUpdate(
      roles.map(r => r.id === id ? { ...r, [field]: value } : r)
    );
  };

  const permissions = [
    'create_process',
    'edit_process',
    'delete_process',
    'view_reports',
    'manage_users',
    'manage_roles'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            Rôles et permissions
          </h3>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={Plus}
          onClick={addRole}
        >
          Ajouter un rôle
        </Button>
      </div>

      <div className="space-y-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className="p-4 bg-white rounded-lg border border-gray-200"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-grow space-y-4">
                  <input
                    type="text"
                    value={role.name}
                    onChange={(e) => updateRole(role.id, 'name', e.target.value)}
                    placeholder="Nom du rôle"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <textarea
                    value={role.description}
                    onChange={(e) => updateRole(role.id, 'description', e.target.value)}
                    placeholder="Description du rôle"
                    rows={2}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <button
                  onClick={() => removeRole(role.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {permissions.map((permission) => (
                    <label
                      key={permission}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={role.permissions.includes(permission)}
                        onChange={(e) => {
                          const newPermissions = e.target.checked
                            ? [...role.permissions, permission]
                            : role.permissions.filter(p => p !== permission);
                          updateRole(role.id, 'permissions', newPermissions);
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {permission.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                    </label>
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