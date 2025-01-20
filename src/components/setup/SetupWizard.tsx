import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { CompanySetup } from './steps/CompanySetup';
import { ProjectSetup } from './steps/ProjectSetup';
import { ProcessStepsSetup } from './steps/ProcessStepsSetup';
import { UsersSetup } from './steps/UsersSetup';
import { RolesSetup } from './steps/RolesSetup';
import type { SetupData } from '../../types/setup';

export const SetupWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [setupData, setSetupData] = useState<SetupData>({
    company: { name: '', description: '' },
    projects: [],
    processSteps: [],
    users: [],
    roles: []
  });

  const steps = [
    {
      title: 'Configuration de l\'entreprise',
      description: 'Informations de base sur votre structure',
      component: (
        <CompanySetup
          data={setupData.company}
          onUpdate={(company) => setSetupData({ ...setupData, company })}
        />
      ),
    },
    {
      title: 'Projets',
      description: 'Définissez les types de projets à gérer',
      component: (
        <ProjectSetup
          projects={setupData.projects}
          onUpdate={(projects) => setSetupData({ ...setupData, projects })}
        />
      ),
    },
    {
      title: 'Étapes des processus',
      description: 'Configurez les étapes pour chaque type de projet',
      component: (
        <ProcessStepsSetup
          projects={setupData.projects}
          steps={setupData.processSteps}
          onUpdate={(processSteps) => setSetupData({ ...setupData, processSteps })}
        />
      ),
    },
    {
      title: 'Utilisateurs',
      description: 'Ajoutez les utilisateurs du système',
      component: (
        <UsersSetup
          users={setupData.users}
          onUpdate={(users) => setSetupData({ ...setupData, users })}
        />
      ),
    },
    {
      title: 'Rôles et permissions',
      description: 'Définissez les rôles et leurs accès',
      component: (
        <RolesSetup
          roles={setupData.roles}
          onUpdate={(roles) => setSetupData({ ...setupData, roles })}
        />
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // TODO: Save setup configuration
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex-1 ${
                    index > 0 ? 'ml-2' : ''
                  }`}
                >
                  <div
                    className={`h-2 rounded-full ${
                      index <= currentStep
                        ? 'bg-blue-600'
                        : 'bg-gray-200'
                    }`}
                  />
                </div>
              ))}
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {steps[currentStep].title}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {steps[currentStep].description}
              </p>
            </div>
          </div>

          <Card>
            {steps[currentStep].component}

            <div className="mt-8 flex justify-between">
              <Button
                variant="secondary"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                Précédent
              </Button>
              <Button
                variant="primary"
                onClick={handleNext}
              >
                {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};