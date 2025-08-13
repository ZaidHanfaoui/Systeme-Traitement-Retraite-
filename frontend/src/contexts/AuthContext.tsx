import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/api';

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  isAdmin: boolean;
  isUser: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const extractRoles = (authData: any): string[] => {
    const roles: string[] = [];

    // Extraire les rôles depuis les authorities
    if (authData.authorities) {
      authData.authorities.forEach((authority: any) => {
        if (typeof authority === 'string') {
          roles.push(authority);
        } else if (authority.authority) {
          roles.push(authority.authority);
        }
      });
    }

    // Extraire les rôles depuis les attributs utilisateur
    if (authData.attributes && authData.attributes.roles) {
      if (Array.isArray(authData.attributes.roles)) {
        roles.push(...authData.attributes.roles);
      }
    }

    // Nettoyer et dédupliquer les rôles
    const uniqueRoles = Array.from(new Set(roles.filter(role => role && typeof role === 'string')));
    return uniqueRoles;
  };

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await authService.getCurrentUser();

      if (response.data) {
        const authData = response.data;
        const userRoles = extractRoles(authData);

        const userData: User = {
          id: authData.name || authData.sub || 'unknown',
          username: authData.preferred_username || authData.name || 'user',
          email: authData.email || '',
          roles: userRoles,
          isAdmin: userRoles.some(role =>
            role.toLowerCase().includes('admin') ||
            role.includes('client_admin')
          ),
          isUser: userRoles.some(role =>
            role.toLowerCase().includes('user') ||
            role.includes('client_employee')
          )
        };

        setUser(userData);
        console.log('Utilisateur authentifié:', userData);
      }
    } catch (error: any) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      setUser(null);
      // En cas d'erreur 401 ou 403, rediriger vers Keycloak
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log('Erreur d\'authentification, redirection vers Keycloak...');
        redirectToKeycloak();
      }
    } finally {
      setLoading(false);
    }
  };

  const redirectToKeycloak = () => {
    console.log('Redirection vers Keycloak...');
    window.location.href = 'http://localhost:8088/oauth2/authorization/keycloak';
  };

  const login = () => {
    redirectToKeycloak();
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setUser(null);
      // Rediriger vers la déconnexion Keycloak
      window.location.href = 'http://localhost:8088/logout';
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
