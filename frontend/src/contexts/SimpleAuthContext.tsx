import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false); // Pas de chargement pour commencer

  const handleLogin = () => {
    // Redirection directe vers Keycloak
    window.location.href = 'http://localhost:8088/oauth2/authorization/keycloak';
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = 'http://localhost:8088/logout';
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    logout: handleLogout,
    login: handleLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
