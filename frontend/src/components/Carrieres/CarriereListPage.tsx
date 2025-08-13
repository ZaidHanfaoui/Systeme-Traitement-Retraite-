import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { carriereService } from '../../services/api';
import { Carriere, RegimeRetraite } from '../../types';
import DossierSelector from '../Common/DossierSelector';
import CreateCarriere from './CreateCarriere';
import FloatingChatbot from '../Chatbot/FloatingChatbot';

const CarriereListPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDossierId, setSelectedDossierId] = useState<number | null>(null);
  const [carrieres, setCarrieres] = useState<Carriere[]>([]);
  const [loading, setLoading] = useState(false);
  const [createCarriereOpen, setCreateCarriereOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDossierId) {
      loadCarrieres();
    } else {
      setCarrieres([]);
    }
  }, [selectedDossierId]);

  const loadCarrieres = async () => {
    if (!selectedDossierId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await carriereService.getCarrieresByDossier(selectedDossierId);
      setCarrieres(response.data || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des carrières:', error);
      setError('Erreur lors du chargement des carrières');
      setCarrieres([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCarriere = async (carriereId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette carrière ?')) {
      return;
    }

    try {
      await carriereService.deleteCarriere(carriereId);
      await loadCarrieres();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression de la carrière');
    }
  };

  const getRegimeColor = (regime: RegimeRetraite) => {
    switch (regime) {
      case RegimeRetraite.GENERAL:
        return 'primary';
      case RegimeRetraite.FONCTION_PUBLIQUE:
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
  <Box sx={{ p: 3, bgcolor: '#fff', color: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <img src="/logo-cimr.png" alt="CIMR Logo" style={{ height: '80px' }} />
      </div>
      {/* En-tête */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" gutterBottom>
          <WorkIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Gestion des Carrières
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/dashboard')}
        >
          Retour au Dashboard
        </Button>
      </Box>
         
      {/* Sélecteur de dossier */}
      <DossierSelector
        selectedDossierId={selectedDossierId}
        onDossierChange={setSelectedDossierId}
        label="Sélectionner un dossier pour gérer ses carrières"
        placeholder="Rechercher un dossier par numéro SS ou nom du bénéficiaire..."
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Contenu principal */}
      {selectedDossierId ? (
        <>
          {/* Bouton d'ajout */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Carrières du dossier sélectionné
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateCarriereOpen(true)}
            >
              Ajouter une Carrière
            </Button>
          </Box>

          {/* Tableau des carrières */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ bgcolor: '#fff', color: 'inherit', boxShadow: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Entreprise</TableCell>
                    <TableCell>Poste</TableCell>
                    <TableCell>Période</TableCell>
                    <TableCell>Salaire Moyen</TableCell>
                    <TableCell>Régime</TableCell>
                    <TableCell>Trimestres</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {carrieres.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                          Aucune carrière trouvée pour ce dossier
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    carrieres.map((carriere) => (
                      <TableRow key={carriere.id}>
                        <TableCell>{carriere.entreprise}</TableCell>
                        <TableCell>{carriere.poste}</TableCell>
                        <TableCell>
                          {new Date(carriere.dateDebut).toLocaleDateString()} -
                          {carriere.dateFin
                            ? new Date(carriere.dateFin).toLocaleDateString()
                            : ' En cours'
                          }
                        </TableCell>
                        <TableCell>
                          {carriere.salaireMoyen?.toLocaleString() || 'N/A'} €
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={carriere.regimeRetraite}
                            color={getRegimeColor(carriere.regimeRetraite)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{carriere.trimestresValides || 0}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => {
                              // TODO: Implémenter la modification
                              console.log('Modifier carrière:', carriere.id);
                            }}
                            color="primary"
                            title="Modifier"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteCarriere(carriere.id!)}
                            color="error"
                            title="Supprimer"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <WorkIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Sélectionnez un dossier
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Veuillez sélectionner un dossier ci-dessus pour voir et gérer ses carrières
          </Typography>
        </Paper>
      )}

      {/* Dialog de création */}
      {selectedDossierId && (
        <CreateCarriere
          open={createCarriereOpen}
          onClose={() => setCreateCarriereOpen(false)}
          dossierId={selectedDossierId}
          onSuccess={loadCarrieres}
        />
      )}

      {/* Chatbot flottant */}
      <FloatingChatbot />
    </Box>
  );
};

export default CarriereListPage;
