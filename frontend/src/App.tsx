import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Layout from './components/Layout/Layout';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import AnalyseSysteme from './pages/AnalyseSysteme';
import DossierList from './components/Dossiers/DossierList';
import DossierDetail from './components/Dossiers/DossierDetail';
import CreateDossier from './components/Dossiers/CreateDossier';
import CarriereListPage from './components/Carrieres/CarriereListPage';
import DocumentListPage from './components/Documents/DocumentListPage';
import PaiementListPage from './components/Paiements/PaiementListPage';
// import ReportingPage from './components/ReportingPage'; // à créer

import { useAuth } from './contexts/AuthContext';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null; // Or a loading spinner
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: '#059669' },
      secondary: { main: '#1e3a8a' },
    },
  }), [mode]);

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      console.log('Theme mode changed to:', next);
      return next;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <RequireAuth>
                <Layout toggleMode={toggleMode} mode={mode}>
                  <AdminDashboard />
                </Layout>
              </RequireAuth>
            } />
            <Route path="/dossiers" element={
              <RequireAuth>
                <Layout toggleMode={toggleMode} mode={mode}>
                  <DossierList />
                </Layout>
              </RequireAuth>
            } />
            <Route path="/dossiers/:id" element={
              <RequireAuth>
                <Layout toggleMode={toggleMode} mode={mode}>
                  <DossierDetail />
                </Layout>
              </RequireAuth>
            } />
            <Route path="/dossiers/nouveau" element={
              <RequireAuth>
                <Layout toggleMode={toggleMode} mode={mode}>
                  <CreateDossier open={true} onClose={() => window.history.back()} />
                </Layout>
              </RequireAuth>
            } />
            <Route path="/carrieres" element={
              <RequireAuth>
                <Layout toggleMode={toggleMode} mode={mode}>
                  <CarriereListPage />
                </Layout>
              </RequireAuth>
            } />
            <Route path="/documents" element={
              <RequireAuth>
                <Layout toggleMode={toggleMode} mode={mode}>
                  <DocumentListPage />
                </Layout>
              </RequireAuth>
            } />
            <Route path="/paiements" element={
              <RequireAuth>
                <Layout toggleMode={toggleMode} mode={mode}>
                  <PaiementListPage />
                </Layout>
              </RequireAuth>
            } />
            <Route path="/analyse-systeme" element={
              <RequireAuth>
                <Layout toggleMode={toggleMode} mode={mode}>
                  <AnalyseSysteme />
                </Layout>
              </RequireAuth>
            } />
            {/* <Route path="/reporting" element={<ReportingPage />} /> */}
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
