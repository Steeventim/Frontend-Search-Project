export interface Company {
  name: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  type: 'standard' | 'complex' | 'simple';
}

export interface ProcessStep {
  id: string;
  projectId: string;
  name: string;
  description: string;
  order: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface SetupData {
  company: Company;
  projects: Project[];
  processSteps: ProcessStep[];
  users: User[];
  roles: Role[];
}