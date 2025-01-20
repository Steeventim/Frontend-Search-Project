import { LayoutDashboard, FileText, PlusCircle, Users, Building, Settings } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';

export const userMenuItems = [
  { icon: LayoutDashboard, label: 'Tableau de bord', path: ROUTES.USER.DASHBOARD },
  { icon: FileText, label: 'Mes processus', path: ROUTES.USER.PROCESSES },
  { icon: PlusCircle, label: 'Nouveau processus', path: ROUTES.USER.NEW_PROCESS },
];

export const adminMenuItems = [
  { icon: LayoutDashboard, label: 'Tableau de bord', path: ROUTES.ADMIN.DASHBOARD },
  { icon: Users, label: 'Utilisateurs', path: ROUTES.ADMIN.USERS },
  { icon: Building, label: 'Départements', path: ROUTES.ADMIN.DEPARTMENTS },
  { icon: FileText, label: 'Processus', path: ROUTES.ADMIN.PROCESSES },
  { icon: Settings, label: 'Paramètres', path: ROUTES.ADMIN.SETTINGS },
];