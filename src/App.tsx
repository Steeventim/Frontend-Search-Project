import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./constants/routes";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import { SetupWizard } from "./components/setup/SetupWizard";
import { AdminLayout } from "./components/layout/AdminLayout";
import { UserLayout } from "./components/layout/UserLayout";
import { Dashboard } from "./components/dashboard/Dashboard";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { UsersList } from "./components/admin/UsersList";
import { DepartmentsList } from "./components/admin/DepartmentsList";
import { ProcessTemplatesList } from "./components/admin/ProcessTemplatesList";
import { Settings } from "./components/admin/Settings";
import { ProcessList } from "./components/process/ProcessList";
import { ProcessDetails } from "./components/process/ProcessDetails";
import { NewProcess } from "./components/process/NewProcess";
import { UserProfile } from "./components/user/UserProfile";
import { UserSettings } from "./components/user/UserSettings";
import CreateAdminForm from "./components/admin/CreateAdminForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path={ROUTES.AUTH.LOGIN} element={<LoginForm />} />
        <Route path={ROUTES.AUTH.REGISTER} element={<RegisterForm />} />
        <Route path={ROUTES.AUTH.SETUP} element={<SetupWizard />} />
        {/* Admin Routes */}
        <Route path={ROUTES.ADMIN.ROOT} element={<AdminLayout />}>
          <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
          <Route path={ROUTES.ADMIN.USERS} element={<UsersList />} />
          <Route
            path={ROUTES.ADMIN.DEPARTMENTS}
            element={<DepartmentsList />}
          />
          <Route
            path={ROUTES.ADMIN.PROCESSES}
            element={<ProcessTemplatesList />}
          />
          <Route path={ROUTES.ADMIN.SETTINGS} element={<Settings />} />
        </Route>
        <Route path={ROUTES.ADMIN.CREATE_ADMIN} element={<CreateAdminForm />} />

        {/* User Routes */}
        <Route path={ROUTES.USER.ROOT} element={<UserLayout />}>
          <Route path={ROUTES.USER.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.USER.PROCESSES} element={<ProcessList />} />
          <Route path={ROUTES.USER.NEW_PROCESS} element={<NewProcess />} />
          <Route
            path={ROUTES.USER.PROCESS_DETAILS}
            element={<ProcessDetails />}
          />
          <Route path={ROUTES.USER.PROFILE} element={<UserProfile />} />
          <Route path={ROUTES.USER.SETTINGS} element={<UserSettings />} />
          <Route
            path="*"
            element={<Navigate to={ROUTES.AUTH.LOGIN} replace />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
