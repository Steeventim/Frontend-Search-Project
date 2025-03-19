// Centralisation des routes de l'application
export const ROUTES = {
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    SETUP: "/setup",
  },
  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin/dashboard",
    COMPANY: "/admin/company",
    PROJECTS: "/admin/projects",
    PROCESS_STEPS: "/admin/process-steps",
    ROLES: "/admin/roles",
    USERS: "/admin/users",
    SETTINGS: "/admin/settings",
    CREATE_ADMIN: "/admin/create-admin",
  },
  USER: {
    ROOT: "/",
    SEARCH: "/search",
    DASHBOARD: "/dashboard",
    PROCESSES: "/processes",
    NEW_PROCESS: "/processes/new",
    PROCESS_DETAILS: "/processes/:id",
    PROFILE: "/profile",
    SETTINGS: "/settings",
  },
  ERROR: "/error", // Added error route
} as const;
