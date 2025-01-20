// Ajout des processus mockés
export const mockProcesses = [
  {
    id: '1',
    title: 'Demande de congés',
    description: 'Validation de la demande de congés pour la période estivale',
    currentStep: 0,
    status: 'pending',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
    initiatedBy: 'Jean Dupont',
    steps: [
      {
        id: 's1',
        name: 'Validation du responsable direct',
        order: 1,
        assignedTo: 'Marie Martin',
        status: 'pending',
        comments: [],
        requiredLevel: 1
      },
      {
        id: 's2',
        name: 'Validation des RH',
        order: 2,
        assignedTo: 'Service RH',
        status: 'pending',
        comments: [],
        requiredLevel: 2
      }
    ]
  },
  {
    id: '2',
    title: 'Note de frais',
    description: 'Validation des frais de déplacement',
    currentStep: 1,
    status: 'in_progress',
    createdAt: new Date('2024-03-02'),
    updatedAt: new Date('2024-03-03'),
    initiatedBy: 'Marie Martin',
    steps: [
      {
        id: 's3',
        name: 'Soumission des justificatifs',
        order: 1,
        assignedTo: 'Marie Martin',
        status: 'approved',
        comments: [
          {
            id: 'c1',
            text: 'Justificatifs conformes',
            userId: '2',
            userName: 'Jean Dupont',
            timestamp: new Date('2024-03-02')
          }
        ],
        requiredLevel: 1
      },
      {
        id: 's4',
        name: 'Validation comptabilité',
        order: 2,
        assignedTo: 'Service Comptabilité',
        status: 'pending',
        comments: [],
        requiredLevel: 2
      }
    ]
  }
];