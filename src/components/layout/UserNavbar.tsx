import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Bell,
  User,
  LogOut,
  Settings,
  Search,
  Clock,
  Menu as HamburgerMenu,
} from "lucide-react";
import api from "../../services/api";
import Cookies from "js-cookie";

interface Notification {
  id: string;
  title: string;
  message: string;
  processId: string;
  timestamp: Date;
  read: boolean;
}

export const UserNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Temporairement, on initialise avec un tableau vide
    setNotifications([]);

    // Note: Le interval n'est plus nécessaire car nous n'appelons plus l'API
    // mais on peut le garder pour une future implémentation
    const interval = setInterval(() => {
      setNotifications([]);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: "Tableau de bord", path: "/dashboard" },
    { icon: Search, label: "Recherche", path: "/search" },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = async (notification: Notification) => {
    try {
      await api.put(`/notifications/${notification.id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      );
      navigate(`/process/${notification.processId}`);
    } catch (err) {
      console.error(
        "Erreur lors du marquage de la notification comme lue:",
        err
      );
    }
  };

  const handleLogout = async () => {
    try {
      // Supprimer le token et le refresh token des cookies
      Cookies.remove("token");
      Cookies.remove("refreshToken");

      // Appeler l'API pour la déconnexion
      await api.post("/logout");

      // Rediriger vers la page de connexion
      navigate("/login");
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
      // En cas d'erreur, rediriger quand même vers la page de connexion
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et menu principal */}
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold text-blue-600">
              ProcessFlow
            </Link>
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
            {/* Bouton Menu Mobile */}
            <button
              className="sm:hidden ml-4 p-1 text-gray-500 hover:text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <HamburgerMenu className="h-6 w-6" />
            </button>
          </div>

          {/* Groupe notifications et profil */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">Voir les notifications</span>
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900">
                          Notifications
                        </h3>
                        {notifications.length > 0 && (
                          <span className="text-xs text-gray-500">
                            {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 divide-y divide-gray-100">
                        {notifications.length === 0 ? (
                          <p className="text-sm text-gray-500 py-2">
                            Aucune notification
                          </p>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                              className={`py-3 flex items-start cursor-pointer hover:bg-gray-50 ${
                                !notification.read ? "bg-blue-50" : ""
                              }`}
                            >
                              <div className="flex-shrink-0 pt-0.5">
                                <Clock className="h-5 w-5 text-gray-400" />
                              </div>
                              <div className="ml-3 w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.title}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                  {notification.message}
                                </p>
                                <p className="mt-1 text-xs text-gray-400">
                                  {new Date(
                                    notification.timestamp
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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

        {/* Menu Mobile */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-16 left-0 w-full bg-white shadow-md rounded-b-lg sm:hidden z-50"
            >
              <div className="flex flex-col p-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center py-2 text-gray-700 hover:bg-gray-100 rounded-md px-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
