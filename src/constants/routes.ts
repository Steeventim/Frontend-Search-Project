// Centralisation des routes de l'application
export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    SETUP: '/setup'
  },
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    DEPARTMENTS: '/admin/departments',
    PROCESSES: '/admin/processes',
    SETTINGS: '/admin/settings'
  },
  USER: {
    ROOT: '/',
    DASHBOARD: '/dashboard',
    PROCESSES: '/processes',
    NEW_PROCESS: '/processes/new',
    PROCESS_DETAILS: '/processes/:id',
    PROFILE: '/profile',
    SETTINGS: '/settings'
  }
} as const;