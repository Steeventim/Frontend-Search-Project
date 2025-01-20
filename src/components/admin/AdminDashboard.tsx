import React from 'react';
import { Users, FileText, Building } from 'lucide-react';
import { Card } from '../common/Card';

export const AdminDashboard: React.FC = () => {
  const stats = [
    { title: 'Utilisateurs', value: '24', icon: Users },
    { title: 'Processus', value: '12', icon: FileText },
    { title: 'Départements', value: '5', icon: Building },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tableau de bord administrateur</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="flex items-center p-6">
            <div className="p-3 rounded-full bg-blue-100">
              <stat.icon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{stat.title}</h3>
              <p className="text-2xl font-semibold text-blue-600">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};