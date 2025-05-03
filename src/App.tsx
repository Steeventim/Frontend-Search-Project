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
import SetupWizard from "./components/setup/SetupWizard";
import { AdminLayout } from "./components/layout/AdminLayout";
import { UserLayout } from "./components/layout/UserLayout";
import { Dashboard } from "./components/dashboard/Dashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import { Settings } from "./components/admin/Settings";
import ProcessDetails from "./components/process/ProcessDetails";
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
import NotFound from "./components/error/NotFound";

// Import du contexte global pour les permissions
import { RolePermissionsProvider } from "./context/RolePermissionsContext";

// Composant pour protéger les routes
const ProtectedRoute = ({ roles }: { roles?: string[] }) => {
  const token = Cookies.get("token");
  const roleUser = Cookies.get("roleUser");

  if (!token) {
    console.log("Redirecting to login: No token");
    return <Navigate to={ROUTES.AUTH.LOGIN} />;
  }

  if (roles && roleUser && !roles.includes(roleUser)) {
    console.log("Redirecting to login: Role not authorized");
    return <Navigate to={ROUTES.AUTH.LOGIN} />;
  }

  console.log("ProtectedRoute: rendering Outlet");
  return <Outlet />;
};

// Composant principal de l'application
const App = () => {
  return (
    <ErrorBoundary>
      {/* Fournisseur de contexte pour les permissions */}
      <RolePermissionsProvider>
        <BrowserRouter>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Navigate to={ROUTES.AUTH.LOGIN} />} />
            <Route path={ROUTES.AUTH.LOGIN} element={<LoginForm />} />
            <Route path={ROUTES.AUTH.SETUP} element={<SetupWizard />} />

            {/* Routes protégées pour les administrateurs */}
            <Route element={<ProtectedRoute roles={["superadmin", "admin"]} />}>
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
                <Route
                  path={ROUTES.ADMIN.ROLES}
                  element={<RolesManagement />}
                />
                <Route path={ROUTES.ADMIN.USERS} element={<UsersList />} />
                <Route path={ROUTES.ADMIN.SETTINGS} element={<Settings />} />
              </Route>
            </Route>

            {/* Routes protégées pour les utilisateurs */}
            <Route element={<ProtectedRoute />}>
              <Route path={ROUTES.USER.ROOT} element={<UserLayout />}>
                <Route path={ROUTES.USER.DASHBOARD} element={<Dashboard />} />
                <Route
                  path={ROUTES.USER.NEW_PROCESS}
                  element={<NewProcess />}
                />
                <Route
                  path={ROUTES.USER.PROCESS_DETAILS}
                  element={<ProcessDetails />}
                />
                <Route path={ROUTES.USER.PROFILE} element={<UserProfile />} />
                <Route path={ROUTES.USER.SETTINGS} element={<UserSettings />} />
              </Route>
            </Route>

            {/* Route pour l'interface de recherche */}
            <Route element={<ProtectedRoute />}>
              <Route
                path={ROUTES.SEARCH.INTERFACE}
                element={<SearchInterface />}
              />
            </Route>

            {/* Route pour les pages non trouvées */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RolePermissionsProvider>
    </ErrorBoundary>
  );
};

export default App;
