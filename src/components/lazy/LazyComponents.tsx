import { lazy } from "react";

// Lazy loading des composants principaux pour réduire la taille du bundle initial

// Composants d'authentification
export const LazyLoginForm = lazy(() => import("../auth/LoginForm"));

// Composants d'administration
export const LazyAdminDashboard = lazy(() => import("../admin/AdminDashboard"));
export const LazyCompanyManagement = lazy(() =>
  import("../admin/CompanyManagement").then((module) => ({
    default: module.CompanyManagement,
  }))
);
export const LazyCreateAdminForm = lazy(
  () => import("../admin/CreateAdminForm")
);
export const LazyProjectsManagement = lazy(() =>
  import("../admin/ProjectsManagement").then((module) => ({
    default: module.ProjectsManagement,
  }))
);
export const LazyProcessStepsManagement = lazy(() =>
  import("../admin/ProcessStepsManagement").then((module) => ({
    default: module.ProcessStepsManagement,
  }))
);
export const LazyProcessTemplatesList = lazy(() =>
  import("../admin/ProcessTemplatesList").then((module) => ({
    default: module.ProcessTemplatesList,
  }))
);
export const LazyRolesManagement = lazy(() =>
  import("../admin/RolesManagement").then((module) => ({
    default: module.RolesManagement,
  }))
);
export const LazyUsersList = lazy(() =>
  import("../admin/UsersList").then((module) => ({ default: module.UsersList }))
);
export const LazySettings = lazy(() =>
  import("../admin/Settings").then((module) => ({ default: module.Settings }))
);

// Composants de layout
export const LazyAdminLayout = lazy(() =>
  import("../layout/AdminLayout").then((module) => ({
    default: module.AdminLayout,
  }))
);
export const LazyUserLayout = lazy(() =>
  import("../layout/UserLayout").then((module) => ({
    default: module.UserLayout,
  }))
);

// Composants de dashboard
export const LazyDashboard = lazy(() =>
  import("../dashboard/Dashboard").then((module) => ({
    default: module.Dashboard,
  }))
);

// Composants de processus
export const LazyProcessDetails = lazy(
  () => import("../process/ProcessDetails")
);
export const LazyNewProcess = lazy(() =>
  import("../process/NewProcess").then((module) => ({
    default: module.NewProcess,
  }))
);
export const LazySearchInterface = lazy(
  () => import("../process/SearchInterface")
);

// Composants utilisateur
export const LazyUserProfile = lazy(() =>
  import("../user/UserProfile").then((module) => ({
    default: module.UserProfile,
  }))
);
export const LazyUserSettings = lazy(() =>
  import("../user/UserSettings").then((module) => ({
    default: module.UserSettings,
  }))
);

// Composants de configuration
export const LazySetupWizard = lazy(() => import("../setup/SetupWizard"));

// Composants d'erreur
export const LazyNotFound = lazy(() => import("../error/NotFound"));
