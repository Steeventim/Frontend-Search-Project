import React, { createContext, useContext, useState } from "react";

interface RolePermissions {
  [roleName: string]: string[]; // Exemple : { "Admin": ["Valider", "Rechercher"] }
}

interface RolePermissionsContextType {
  permissions: RolePermissions;
  setPermissions: React.Dispatch<React.SetStateAction<RolePermissions>>;
}

const RolePermissionsContext = createContext<RolePermissionsContextType | null>(
  null
);

export const RolePermissionsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [permissions, setPermissions] = useState<RolePermissions>({});

  return (
    <RolePermissionsContext.Provider value={{ permissions, setPermissions }}>
      {children}
    </RolePermissionsContext.Provider>
  );
};

export const useRolePermissions = () => {
  const context = useContext(RolePermissionsContext);
  if (!context) {
    throw new Error(
      "useRolePermissions doit être utilisé dans un RolePermissionsProvider"
    );
  }
  return context;
};
