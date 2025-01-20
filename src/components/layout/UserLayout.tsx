import React from 'react';
import { Outlet } from 'react-router-dom';
import { UserNavbar } from './UserNavbar';

export const UserLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <UserNavbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};