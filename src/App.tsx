import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ROUTES } from "./constants/routes";
import Cookies from "js-cookie";
import { ErrorBoundary } from "./components/error/ErrorBoundary";
import { SuspenseWrapper } from "./components/common/SuspenseWrapper";
import {
  LazyLoginForm,
  LazySetupWizard,
  LazyAdminLayout,
  LazyUserLayout,
  LazyDashboard,
  LazyAdminDashboard,
  LazySettings,
  LazyProcessDetails,
  LazyNewProcess,
  LazyUserProfile,
  LazyUserSettings,
  LazyCreateAdminForm,
  LazyCompanyManagement,
  LazyProjectsManagement,
  LazyProcessStepsManagement,
  LazyProcessTemplatesList,
  LazyRolesManagement,
  LazyUsersList,
  LazySearchInterface,
  LazyNotFound,
} from "./components/lazy/LazyComponents";

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
            <Route
              path={ROUTES.AUTH.LOGIN}
              element={
                <SuspenseWrapper>
                  <LazyLoginForm />
                </SuspenseWrapper>
              }
            />
            <Route
              path={ROUTES.AUTH.SETUP}
              element={
                <SuspenseWrapper>
                  <LazySetupWizard />
                </SuspenseWrapper>
              }
            />

            {/* Routes protégées pour les administrateurs */}
            <Route element={<ProtectedRoute roles={["superadmin", "admin"]} />}>
              <Route
                path={ROUTES.ADMIN.ROOT}
                element={
                  <SuspenseWrapper>
                    <LazyAdminLayout />
                  </SuspenseWrapper>
                }
              >
                <Route
                  path={ROUTES.ADMIN.DASHBOARD}
                  element={
                    <SuspenseWrapper>
                      <LazyAdminDashboard />
                    </SuspenseWrapper>
                  }
                />
                <Route
                  path={ROUTES.ADMIN.CREATE_ADMIN}
                  element={
                    <SuspenseWrapper>
                      <LazyCreateAdminForm />
                    </SuspenseWrapper>
                  }
                />
                <Route
                  path={ROUTES.ADMIN.COMPANY}
                  element={
                    <SuspenseWrapper>
                      <LazyCompanyManagement />
                    </SuspenseWrapper>
                  }
                />
                <Route
                  path={ROUTES.ADMIN.PROCESS_STEPS}
                  element={
                    <SuspenseWrapper>
                      <LazyProcessTemplatesList />
                    </SuspenseWrapper>
                  }
                />
                <Route
                  path={ROUTES.ADMIN.PROJECTS}
                  element={
                    <SuspenseWrapper>
                      <LazyProjectsManagement />
                    </SuspenseWrapper>
                  }
                />
                <Route
                  path={ROUTES.ADMIN.PROCESS_STEPS}
                  element={
                    <SuspenseWrapper>
                      <LazyProcessStepsManagement />
                    </SuspenseWrapper>
                  }
                />
                <Route
                  path={ROUTES.ADMIN.ROLES}
                  element={
                    <SuspenseWrapper>
                      <LazyRolesManagement />
                    </SuspenseWrapper>
                  }
                />
                <Route
                  path={ROUTES.ADMIN.USERS}
                  element={
                    <SuspenseWrapper>
                      <LazyUsersList />
                    </SuspenseWrapper>
                  }
                />
                <Route
                  path={ROUTES.ADMIN.SETTINGS}
                  element={
                    <SuspenseWrapper>
                      <LazySettings />
                    </SuspenseWrapper>
                  }
                />
              </Route>
            </Route>

            {/* Routes protégées pour les utilisateurs */}
            <Route element={<ProtectedRoute />}>
              <Route
                path={ROUTES.USER.ROOT}
                element={
                  <SuspenseWrapper>
                    <LazyUserLayout />
                  </SuspenseWrapper>
                }
              >
                <Route
                  path={ROUTES.USER.DASHBOARD}
                  element={
                    <SuspenseWrapper>
                      <LazyDashboard />
                    </SuspenseWrapper>
                  }
                />
                <Route
                  path={ROUTES.USER.NEW_PROCESS}
                  element={
                    <SuspenseWrapper>
                      <LazyNewProcess />
                    </SuspenseWrapper>
                  }
                />
                <Route
                  path={ROUTES.USER.PROCESS_DETAILS}
                  element={
                    <SuspenseWrapper>
                      <LazyProcessDetails />
                    </SuspenseWrapper>
                  }
                />
                <Route
                  path={ROUTES.USER.PROFILE}
                  element={
                    <SuspenseWrapper>
                      <LazyUserProfile />
                    </SuspenseWrapper>
                  }
                />
                <Route
                  path={ROUTES.USER.SETTINGS}
                  element={
                    <SuspenseWrapper>
                      <LazyUserSettings />
                    </SuspenseWrapper>
                  }
                />
              </Route>
            </Route>

            {/* Route pour l'interface de recherche */}
            <Route element={<ProtectedRoute />}>
              <Route
                path={ROUTES.SEARCH.INTERFACE}
                element={
                  <SuspenseWrapper>
                    <LazySearchInterface />
                  </SuspenseWrapper>
                }
              />
            </Route>

            {/* Route pour les pages non trouvées */}
            <Route
              path="*"
              element={
                <SuspenseWrapper>
                  <LazyNotFound />
                </SuspenseWrapper>
              }
            />
          </Routes>
        </BrowserRouter>
      </RolePermissionsProvider>
    </ErrorBoundary>
  );
};

export default App;
