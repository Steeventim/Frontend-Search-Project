import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { User, LogOut, Settings, Bell } from "lucide-react";
import Logo from "../common/Logo";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Logo variant="navbar" size="md" customText="SearchEngine" />
            </div>
          </div>

          <div className="flex items-center">
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Voir les notifications</span>
              <Bell className="h-6 w-6" />
            </button>

            <Menu as="div" className="ml-3 relative">
              <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="sr-only">Ouvrir le menu utilisateur</span>
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
                        onClick={() => navigate("/settings")}
                        className={`${
                          active ? "bg-gray-100" : ""
                        } flex px-4 py-2 text-sm text-gray-700 w-full`}
                      >
                        <Settings className="mr-3 h-5 w-5 text-gray-400" />
                        Paramètres
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => navigate("/login")}
                        className={`${
                          active ? "bg-gray-100" : ""
                        } flex px-4 py-2 text-sm text-gray-700 w-full`}
                      >
                        <LogOut className="mr-3 h-5 w-5 text-gray-400" />
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
