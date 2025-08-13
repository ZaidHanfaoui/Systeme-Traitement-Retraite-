import React from 'react';
import { Box, Button, Typography, Container, Alert } from '@mui/material';
import { Refresh as RefreshIcon, ExitToApp as ExitIcon } from '@mui/icons-material';

const LogoutPage: React.FC = () => {
  const keycloakLoginUrl = 'http://localhost:8088/oauth2/authorization/keycloak';

  const handleCompleteLogout = () => {
    // Nettoyer complètement le navigateur
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(';').forEach((c) => {
      const eqPos = c.indexOf('=');
      const name = eqPos > -1 ? c.substr(0, eqPos) : c;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + window.location.hostname;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.' + window.location.hostname;
    });
    // Rediriger vers Keycloak pour une nouvelle authentification
    window.location.href = keycloakLoginUrl;
  };

  const handleBackToKeycloak = () => {
    window.location.href = keycloakLoginUrl;
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom color="primary">
          Déconnexion réussie
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }} color="text.secondary">
          Vous avez été déconnecté avec succès du système STR.
        </Typography>

        <Alert severity="info" sx={{ mb: 3, width: '100%' }}>
          Pour vous connecter avec un autre compte, cliquez sur "Nouvelle connexion" ci-dessous.
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', width: '100%' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<ExitIcon />}
            onClick={handleBackToKeycloak}
            sx={{ py: 1.5 }}
          >
            Nouvelle connexion
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<RefreshIcon />}
            onClick={handleCompleteLogout}
            sx={{ py: 1.5 }}
          >
            Nettoyer le cache et recommencer
          </Button>
        </Box>

        <Typography variant="caption" sx={{ mt: 3 }} color="text.secondary">
          Si vous rencontrez des problèmes de connexion, utilisez "Nettoyer le cache"
        </Typography>
      </Box>
    </Container>
  );
};

export default LogoutPage;
