// src/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getPermission } from "src/services/requests/user.service";

interface AuthContextType {
  role: string | null;
  setRole: (role: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Si tu as une logique pour récupérer le rôle depuis un cookie, localStorage, ou API, c'est ici.
    // Exemple : récupérer le rôle de l'utilisateur depuis localStorage
    const storedRole = getPermission()
    setRole(storedRole ? storedRole : null); // Si pas de rôle, l'utilisateur est redirigé
  }, []);

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};
