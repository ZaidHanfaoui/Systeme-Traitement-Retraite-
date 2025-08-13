import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';

const Login: React.FC<{ onLogin?: () => void }> = ({ onLogin }) => {
  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      window.open('http://localhost:8088/oauth2/authorization/keycloak', '_self');
    }
  };

  // Supprimer la redirection automatique, laisser uniquement le bouton

  return (
  <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff' }}>
  <Paper sx={{ p: 4, maxWidth: 400, width: '100%', textAlign: 'center', bgcolor: '#fff', color: 'inherit', boxShadow: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
          <img src="/logo-cimr.png" alt="CIMR Logo" style={{ height: '100px' }} />
        </div>

        <Typography variant="h4" gutterBottom>Système de Gestion des Retraites</Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Connectez-vous pour accéder à votre espace sécurisé.
        </Typography>
        <Button variant="contained" color="primary" size="large" onClick={handleLogin} fullWidth>
          Se connecter avec Keycloak
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
