import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface NavLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
}

export const NavLink: React.FC<NavLinkProps> = ({ to, icon: Icon, label }) => (
  <Link
    to={to}
    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
  >
    <Icon className="h-4 w-4 mr-2" />
    {label}
  </Link>
);