"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import {
  LayoutDashboard,
  User,
  LogOut,
  Settings,
  Search,
  MenuIcon as HamburgerMenu,
} from "lucide-react";
import api from "../../services/api";
import Cookies from "js-cookie";
import { NotificationCenter } from "../common/NotificationCenter";
import { useNotifications } from "../../hooks/useNotifications";
import Logo from "../common/Logo";

export const SimplifiedUserNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const handleLogout = async () => {
    try {
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      await api.post("/logout");
      navigate("/login");
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
      navigate("/login");
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Tableau de bord", path: "/dashboard" },
    { icon: Search, label: "Recherche", path: "/search/interface" },
  ];

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et menu principal */}
          <div className="flex items-center">
            <Logo variant="navbar" size="md" to="/dashboard" />
            <div className="hidden sm:flex sm:ml-6 sm:space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              ))}
            </div>
            <button
              className="sm:hidden ml-4 p-1 text-gray-500 hover:text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <HamburgerMenu className="h-6 w-6" />
            </button>
          </div>

          {/* Notifications et profil */}
          <div className="flex items-center space-x-4">
            {/* Utilisation du composant NotificationCenter */}
            <NotificationCenter
              notifications={notifications}
              loading={loading}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onDelete={deleteNotification}
            />

            {/* Menu Utilisateur */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="sr-only">Ouvrir le menu utilisateur</span>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
              </Menu.Button>

              <Transition
                as={React.Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/profile"
                        className={`${
                          active ? "bg-gray-100" : ""
                        } flex px-4 py-2 text-sm text-gray-700`}
                      >
                        <User className="h-5 w-5 mr-2" />
                        Mon profil
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/settings"
                        className={`${
                          active ? "bg-gray-100" : ""
                        } flex px-4 py-2 text-sm text-gray-700`}
                      >
                        <Settings className="h-5 w-5 mr-2" />
                        Paramètres
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? "bg-gray-100" : ""
                        } flex w-full px-4 py-2 text-sm text-gray-700 items-center`}
                      >
                        <LogOut className="h-5 w-5 mr-2" />
                        Déconnexion
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
};
