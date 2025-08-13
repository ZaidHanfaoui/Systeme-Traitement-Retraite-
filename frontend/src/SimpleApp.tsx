import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

// Version simplifiée pour test
function SimpleApp() {
  console.log('SimpleApp is rendering');

  return (
    <Router>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Test - Application STR
        </Typography>
        <Typography variant="body1">
          Si vous voyez ce message, React fonctionne correctement.
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Problème détecté : L'API /api/auth/me retourne un utilisateur anonyme.
        </Typography>

        <Routes>
          <Route path="*" element={
            <Box sx={{ mt: 3, p: 2, border: '1px solid #ccc' }}>
              <Typography variant="h6">Diagnostic</Typography>
              <Typography variant="body2">
                • Frontend React : ✅ Fonctionne<br/>
                • Backend Spring : ❓ À vérifier<br/>
                • Authentification Keycloak : ❌ Problème détecté
              </Typography>
            </Box>
          } />
        </Routes>
      </Box>
    </Router>
  );
}

export default SimpleApp;
