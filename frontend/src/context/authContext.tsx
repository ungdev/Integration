import React, { createContext, useContext, useState, ReactNode } from 'react';

// Définir l'interface de l'utilisateur
interface User {
  email: string;
  role: 'admin' | 'user';  // Exemple de rôles, tu peux étendre selon tes besoins
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// Créer le contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider pour envelopper l'application
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => setUser(user);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour accéder au contexte
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'AuthProvider');
  }
  return context;
};
