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
  Delete as DeleteIcon,
  Payment as PaymentIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { paiementService } from '../../services/api';
import { Paiement, TypePaiement, DossierSelectorProps } from '../../types';
import DossierSelector from '../Common/DossierSelector';
import CreatePaiement from './CreatePaiement';
import FloatingChatbot from '../Chatbot/FloatingChatbot';

const PaiementListPage: React.FC = () => {
  const navigate = useNavigate();
  // import PaiementBarChart from './PaiementBarChart';
  const [selectedDossierId, setSelectedDossierId] = useState<number | null>(null);
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [loading, setLoading] = useState(false);
  const [createPaiementOpen, setCreatePaiementOpen] = useState(false);
  const [editingPaiement, setEditingPaiement] = useState<Paiement | null>(null);
  const [editPaiementOpen, setEditPaiementOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDossierId) {
      loadPaiements();
    } else {
      setPaiements([]);
    }
  }, [selectedDossierId]);

  const loadPaiements = async () => {
    if (!selectedDossierId) return;

    try {
      setError(null);
      const response = await paiementService.getPaiementsByDossier(selectedDossierId);
      setPaiements(response.data || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des paiements:', error);
      setError('Erreur lors du chargement des paiements');
      setPaiements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaiement = async (paiementId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) {
      return;
    }

    try {
      await paiementService.deletePaiement(paiementId);
      await loadPaiements();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression du paiement');
    }
  };

  const getStatutColor = (statut?: string) => {
    switch (statut) {
      case 'VALIDE':
        return 'success';
      case 'EN_ATTENTE':
        return 'warning';
      case 'REJETE':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <img src="/logo-cimr.png" alt="CIMR Logo" style={{ height: '80px' }} />
      </div>
      {/* En-tête */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" gutterBottom>
          <PaymentIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Gestion des Paiements
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
        label="Sélectionner un dossier pour gérer ses paiements"
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
              Paiements du dossier sélectionné
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreatePaiementOpen(true)}
            >
              Ajouter un Paiement
            </Button>
          </Box>

          {/* Tableau des paiements */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date de Versement</TableCell>
                    <TableCell>Montant</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Référence</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paiements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                          Aucun paiement trouvé pour ce dossier
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paiements.map((paiement) => (
                      <TableRow key={paiement.id}>
                        <TableCell>
                          {paiement.dateVersement
                            ? new Date(paiement.dateVersement).toLocaleDateString()
                            : 'N/A'
                          }
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {paiement.montant.toLocaleString()} €
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={paiement.typePaiement}
                            color="primary"
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{paiement.reference || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip
                            label={paiement.statut || 'En cours'}
                            color={getStatutColor(paiement.statut)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setEditingPaiement(paiement);
                              setEditPaiementOpen(true);
                            }}
                            color="primary"
                            title="Modifier"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeletePaiement(paiement.id!)}
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
          <PaymentIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Sélectionnez un dossier
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Veuillez sélectionner un dossier ci-dessus pour voir et gérer ses paiements
          </Typography>
        </Paper>
      )}

      {/* Dialog de création */}
      {selectedDossierId && (
        <CreatePaiement
          open={createPaiementOpen}
          onClose={() => setCreatePaiementOpen(false)}
          dossierId={selectedDossierId}
          onSuccess={loadPaiements}
        />
      )}
      {/* Dialog de modification */}
      {editPaiementOpen && editingPaiement && (
        <CreatePaiement
          open={editPaiementOpen}
          onClose={() => {
            setEditPaiementOpen(false);
            setEditingPaiement(null);
          }}
          dossierId={selectedDossierId!}
          paiement={editingPaiement}
          isEdit={true}
          onSuccess={loadPaiements}
        />
      )}

      {/* Chatbot flottant */}
      <FloatingChatbot />
    </Box>
  );
};

export default PaiementListPage;
