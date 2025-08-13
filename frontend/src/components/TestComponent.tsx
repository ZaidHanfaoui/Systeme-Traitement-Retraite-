import React from 'react';
import { Box, Typography, Paper, Button, Alert } from '@mui/material';
import { Link } from 'react-router-dom';

const TestComponent: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Test de l'application
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Si vous voyez ce message, l'application fonctionne correctement.
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Vérifications à faire :</strong>
          </Typography>
          <Typography variant="body2" component="div" sx={{ mt: 1 }}>
            • ✅ Le chatbot devrait être visible en bas à gauche<br/>
            • ✅ La barre de sélection de dossier devrait être visible sur les pages Documents, Carrières, Paiements<br/>
            • ✅ L'authentification devrait rediriger vers Keycloak<br/>
            • ✅ Le bouton de déconnexion devrait fonctionner
          </Typography>
        </Alert>

        <Typography variant="h6" gutterBottom>
          Pages à tester :
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <Button
            variant="outlined"
            component={Link}
            to="/documents"
            sx={{ mb: 1 }}
          >
            Page Documents
          </Button>
          <Button
            variant="outlined"
            component={Link}
            to="/carrieres"
            sx={{ mb: 1 }}
          >
            Page Carrières
          </Button>
          <Button
            variant="outlined"
            component={Link}
            to="/paiements"
            sx={{ mb: 1 }}
          >
            Page Paiements
          </Button>
          <Button
            variant="outlined"
            component={Link}
            to="/dossiers"
            sx={{ mb: 1 }}
          >
            Page Dossiers
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary">
          <strong>Instructions :</strong><br/>
          1. Vérifiez que le chatbot est visible en bas à gauche<br/>
          2. Allez sur les pages Documents, Carrières, Paiements<br/>
          3. Vérifiez que la barre de sélection de dossier apparaît<br/>
          4. Testez la sélection de différents dossiers<br/>
          5. Vérifiez que les données changent selon le dossier sélectionné
        </Typography>
      </Paper>
    </Box>
  );
};

export default TestComponent; 