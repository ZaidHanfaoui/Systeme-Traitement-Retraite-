import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress } from '@mui/material';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthContextType } from './types';

// Components
import Layout from './components/Layout/Layout';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import CreateDossier from './components/Dossiers/CreateDossier';
import DossierList from './components/Dossiers/DossierList';
import DossierDetail from './components/Dossiers/DossierDetail';
import CarriereListPage from './components/Carrieres/CarriereListPage';
import DocumentListPage from './components/Documents/DocumentListPage';
import PaiementListPage from './components/Paiements/PaiementListPage';
import FloatingChatbot from './components/Chatbot/FloatingChatbot';
import Login from './components/Auth/Login';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#059669',
    },
    secondary: {
      main: '#1e3a8a',
    },
  },
});

// Composant de protection des routes avec vérification d'authentification
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
        <Box sx={{ ml: 2 }}>Connexion en cours...</Box>
      </Box>
    );
  }

  // Si pas authentifié, rediriger vers la page de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Composant Login avec gestion de la redirection Keycloak
const LoginPage = () => {
  const handleKeycloakLogin = () => {
    console.log('Redirection vers Keycloak...');
    window.location.href = 'http://localhost:8088/oauth2/authorization/keycloak';
  };

  return <Login />;
};

const WorkingApp: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <Routes>
              {/* Route de login */}
              <Route path="/login" element={<LoginPage />} />

              {/* Route de déconnexion - redirection vers login */}
              <Route path="/logout" element={<Navigate to="/login" replace />} />

              {/* Routes protégées - TOUTES utilisent le dashboard admin */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                    <FloatingChatbot />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                    <FloatingChatbot />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                    <FloatingChatbot />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dossiers"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <DossierList />
                      <FloatingChatbot />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dossiers/:id"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <DossierDetail />
                      <FloatingChatbot />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dossiers/nouveau"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CreateDossier
                        open={true}
                        onClose={() => window.location.href = '/dossiers'}
                        onSuccess={async () => {
                          window.location.href = '/dossiers';
                        }}
                      />
                      <FloatingChatbot />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/carrieres"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CarriereListPage />
                      <FloatingChatbot />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/documents"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <DocumentListPage />
                      <FloatingChatbot />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/paiements"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <PaiementListPage />
                      <FloatingChatbot />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Route catch-all pour rediriger vers le dashboard admin */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default WorkingApp;
