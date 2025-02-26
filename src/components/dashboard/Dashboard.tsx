import React, { useState } from "react";
import { ProcessList } from "../process/ProcessList";
import { ProcessDetails } from "../process/ProcessDetails";
import type { Process } from "../../types";

// Exemple de données (à remplacer par vos données réelles)
const mockProcesses: Process[] = [
  {
    id: "1",
    title: "Demande de congés",
    description: "Validation de la demande de congés pour la période estivale",
    currentStep: 0,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    initiatedBy: "Jean Dupont",
    steps: [
      {
        id: "s1",
        name: "Validation du responsable direct",
        order: 1,
        assignedTo: "Marie Martin",
        status: "pending",
        comments: [],
        requiredLevel: 1,
      },
      {
        id: "s2",
        name: "Validation des RH",
        order: 2,
        assignedTo: "Service RH",
        status: "pending",
        comments: [],
        requiredLevel: 2,
      },
    ],
  },
];

export const Dashboard: React.FC = () => {
  const [processes] = useState<Process[]>(mockProcesses);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);

  const handleApprove = (stepId: string, comment: string) => {
    // Implémenter la logique d'approbation
    console.log("Approved:", stepId, comment);
  };

  const handleReject = (stepId: string, comment: string) => {
    // Implémenter la logique de rejet
    console.log("Rejected:", stepId, comment);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Suivi des Processus
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProcessList
              processes={processes}
              onProcessSelect={setSelectedProcess}
            />
          </div>
          <div className="lg:col-span-2">
            {selectedProcess ? (
              <ProcessDetails
                process={selectedProcess}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                Sélectionnez un processus pour voir les détails
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
