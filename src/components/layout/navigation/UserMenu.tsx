import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { User, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

export const UserMenu: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Menu as="div" className="ml-3 relative">
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
              <Link
                to={ROUTES.USER.PROFILE}
                className={`${
                  active ? 'bg-gray-100' : ''
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
                to={ROUTES.USER.SETTINGS}
                className={`${
                  active ? 'bg-gray-100' : ''
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
                onClick={() => navigate(ROUTES.AUTH.LOGIN)}
                className={`${
                  active ? 'bg-gray-100' : ''
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
  );
};