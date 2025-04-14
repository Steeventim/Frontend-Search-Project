import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { User, LogOut, Settings } from "lucide-react";
import Cookies from "js-cookie";

export const SearchNavbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Supprimer le token des cookies
      Cookies.remove("token");
      Cookies.remove("refreshToken");

      // Rediriger vers la page de connexion
      navigate("/login");
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/search/interface" className="text-xl font-bold text-blue-600">
              Recherche
            </Link>
          </div>

          {/* Zone utilisateur */}
          <div className="flex items-center space-x-4">
            <Menu as="div" className="relative">
              <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                {/* <span className="sr-only">Ouvrir le menu utilisateur</span> */}
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
