import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import {
  Building,
  Settings,
  LogOut,
  LayoutDashboard,
  FileText,
  ListOrdered,
  Shield,
  Users,
  User,
  Menu as HamburgerMenu,
} from "lucide-react";
import Logo from "../common/Logo";
import { NotificationButton } from "../common/NotificationButton";

export const AdminNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // État pour gérer l'ouverture du menu

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Tableau de bord",
      path: "/admin/dashboard",
    },
    { icon: Building, label: "Entreprise", path: "/admin/company" },
    { icon: FileText, label: "Projets", path: "/admin/projects" },
    {
      icon: ListOrdered,
      label: "Étapes des Projets",
      path: "/admin/process-steps",
    },
    { icon: Shield, label: "Rôles et permissions", path: "/admin/roles" },
    { icon: Users, label: "Utilisateurs", path: "/admin/users" },
    { icon: Settings, label: "Paramètres", path: "/admin/settings" },
  ];

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Logo
                variant="navbar"
                size="md"
                to="/admin/dashboard"
                customText="SearchEngine Admin"
              />
            </div>
            {/* Menu Hamburger pour petits écrans */}
            <div className="flex sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-controls="mobile-menu"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Ouvrir le menu</span>
                <HamburgerMenu className="h-6 w-6" />
              </button>
            </div>
            {/* Menu principal pour écrans plus grands */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
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
          </div>

          <div className="flex items-center space-x-4">
            <NotificationButton />
            
            <Menu as="div" className="relative">
              <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
              </Menu.Button>

              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => navigate("/login")}
                        className={`${
                          active ? "bg-gray-100" : ""
                        } flex w-full px-4 py-2 text-sm text-gray-700`}
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

      {/* Menu mobile */}
      <div
        className={`${isMenuOpen ? "block" : "hidden"} sm:hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900"
              onClick={() => setIsMenuOpen(false)} // Fermer le menu après la sélection
            >
              <item.icon className="h-4 w-4 mr-2 inline" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
