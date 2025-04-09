import React from "react";
import { Outlet } from "react-router-dom";
import { AdminNavbar } from "./AdminNavbar";

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};
