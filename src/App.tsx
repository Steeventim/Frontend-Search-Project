// import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ROUTES } from "./constants/routes";
import Cookies from "js-cookie";
import LoginForm from "./components/auth/LoginForm";
// import RegisterForm from "./components/auth/RegisterForm";
import SetupWizard from "./components/setup/SetupWizard";
import { AdminLayout } from "./components/layout/AdminLayout";
import { UserLayout } from "./components/layout/UserLayout";
import { Dashboard } from "./components/dashboard/Dashboard";
import { AdminDashboard } from "./components/admin/AdminDashboard";
// import { DepartmentsList } from "./components/admin/DepartmentsList";
// import { ProcessTemplatesList } from "./components/admin/ProcessTemplatesList";
import { Settings } from "./components/admin/Settings";
import { ProcessList } from "./components/process/ProcessList";
import { ProcessDetails } from "./components/process/ProcessDetails";
import { NewProcess } from "./components/process/NewProcess";
import { UserProfile } from "./components/user/UserProfile";
import { UserSettings } from "./components/user/UserSettings";
import CreateAdminForm from "./components/admin/CreateAdminForm";
import { CompanyManagement } from "./components/admin/CompanyManagement";
import { ProjectsManagement } from "./components/admin/ProjectsManagement";
import { ProcessStepsManagement } from "./components/admin/ProcessStepsManagement";
import { ProcessTemplatesList } from "./components/admin/ProcessTemplatesList";
import { RolesManagement } from "./components/admin/RolesManagement";
import { UsersList } from "./components/admin/UsersList";
import SearchInterface from "./components/process/SearchInterface";
import { ErrorBoundary } from "./components/error/ErrorBoundary";

const ProtectedRoute = ({ roles }: { roles: string[] }) => {
  const token = Cookies.get("token");
  const userRole = Cookies.get("role");

  if (!token) {
    return <Navigate to={ROUTES.AUTH.LOGIN} />;
  }

  if (roles && !roles.includes(userRole || "")) {
    return <Navigate to={ROUTES.AUTH.LOGIN} />;
  }

  return <Outlet />;
};

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Redirection de la racine vers la page de connexion si non authentifié */}
          <Route path="/" element={<Navigate to={ROUTES.AUTH.LOGIN} />} />

          {/* Auth Routes */}
          <Route path={ROUTES.AUTH.LOGIN} element={<LoginForm />} />
          {/* <Route path={ROUTES.AUTH.REGISTER} element={<RegisterForm />} /> */}
          <Route path={ROUTES.AUTH.SETUP} element={<SetupWizard />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute roles={["admin", "superadmin"]} />}>
            <Route path={ROUTES.ADMIN.ROOT} element={<AdminLayout />}>
              <Route
                path={ROUTES.ADMIN.DASHBOARD}
                element={<AdminDashboard />}
              />
              <Route
                path={ROUTES.ADMIN.CREATE_ADMIN}
                element={<CreateAdminForm />}
              />
              <Route
                path={ROUTES.ADMIN.COMPANY}
                element={<CompanyManagement />}
              />
              <Route
                path={ROUTES.ADMIN.PROCESS_STEPS}
                element={<ProcessTemplatesList />}
              />
              <Route
                path={ROUTES.ADMIN.PROJECTS}
                element={<ProjectsManagement />}
              />
              <Route
                path={ROUTES.ADMIN.PROCESS_STEPS}
                element={<ProcessStepsManagement />}
              />
              <Route path={ROUTES.ADMIN.ROLES} element={<RolesManagement />} />
              <Route path={ROUTES.ADMIN.USERS} element={<UsersList />} />
              <Route path={ROUTES.ADMIN.SETTINGS} element={<Settings />} />
            </Route>
          </Route>

          {/* User Routes */}
          <Route
            element={<ProtectedRoute roles={["user", "admin", "superadmin"]} />}
          >
            <Route path={ROUTES.USER.ROOT} element={<UserLayout />}>
              <Route path={ROUTES.USER.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.USER.PROCESSES} element={<ProcessList />} />
              <Route path={ROUTES.USER.NEW_PROCESS} element={<NewProcess />} />
              <Route path={ROUTES.USER.SEARCH} element={<SearchInterface />} />
              <Route
                path={ROUTES.USER.PROCESS_DETAILS}
                element={<ProcessDetails />}
              />
              <Route path={ROUTES.USER.PROFILE} element={<UserProfile />} />
              <Route path={ROUTES.USER.SETTINGS} element={<UserSettings />} />
            </Route>
          </Route>
          <Route
            path="*"
            element={<Navigate to={ROUTES.AUTH.LOGIN} replace />}
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
