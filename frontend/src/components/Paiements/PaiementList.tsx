import React, { useState, useEffect, useCallback } from 'react';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Autocomplete,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { paiementService, dossierService } from '../../services/api';
import { Paiement, TypePaiement, DossierRetraite } from '../../types';
import PaiementBarChart from './PaiementBarChart';
// ...existing code...

// Fonction utilitaire pour le diagramme
const getPaiementTypeStats = (paiements: Paiement[]): Record<string, number> => {
  const stats: Record<string, number> = {};
  paiements.forEach((p) => {
    const type = p.typePaiement || 'Autre';
    stats[type] = (stats[type] || 0) + 1;
  });
  return stats;
};

interface PaiementListProps {
  dossierId?: number;
}

const PaiementList: React.FC<PaiementListProps> = ({ dossierId }) => {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [dossiers, setDossiers] = useState<DossierRetraite[]>([]);
  const [selectedDossier, setSelectedDossier] = useState<DossierRetraite | null>(null);
  const [selectedDossierId, setSelectedDossierId] = useState<number | null>(dossierId || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPaiement, setEditingPaiement] = useState<Paiement | null>(null);
  const [formData, setFormData] = useState({
    montant: 0,
    dateVersement: '',
    datePaiement: '',
    typePaiement: TypePaiement.PENSION,
    reference: '',
    statut: 'EN_ATTENTE',
    dossierId: null as number | null,
  });

  useEffect(() => {
    loadDossiers();
  }, []);

  useEffect(() => {
    if (selectedDossierId) {
      loadPaiements();
    }
  }, [selectedDossierId]);

  const loadDossiers = async () => {
    try {
      const response = await dossierService.getAllDossiers();
      setDossiers(response.data || []);
      if (response.data && response.data.length > 0) {
        setSelectedDossier(response.data[0]);
        setSelectedDossierId(response.data[0].id || null);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des dossiers:', error);
      setError('Erreur lors du chargement des dossiers');
    }
  };

  const loadPaiements = async () => {
    if (!selectedDossierId) return;

    try {
      setLoading(true);
      const response = await paiementService.getPaiementsByDossier(selectedDossierId);
      setPaiements(response.data || []);
      setError(null);
    } catch (error) {
      console.error('Erreur lors du chargement des paiements:', error);
      setError('Erreur lors du chargement des paiements');
      setPaiements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDossierId) {
      setError('Veuillez sélectionner un dossier');
      return;
    }

    if (!formData.montant || !formData.dateVersement) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setError(null);

      const paiementData = {
        montant: Number(formData.montant),
        dateVersement: formData.dateVersement,
        datePaiement: formData.datePaiement,
        typePaiement: formData.typePaiement,
        reference: formData.reference,
        statut: formData.statut,
        dossierId: selectedDossierId,
      };

      if (editingPaiement && editingPaiement.id) {
        await paiementService.updatePaiement(editingPaiement.id, paiementData);
      } else {
        await paiementService.createPaiement(paiementData);
      }

      setDialogOpen(false);
      setEditingPaiement(null);
      resetForm();
      await loadPaiements();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError('Erreur lors de la sauvegarde du paiement');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) {
      try {
        await paiementService.deletePaiement(id);
        await loadPaiements();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError('Erreur lors de la suppression du paiement');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      montant: 0,
      dateVersement: '',
      datePaiement: '',
      typePaiement: TypePaiement.PENSION,
      reference: '',
      statut: 'EN_ATTENTE',
      dossierId: selectedDossierId,
    });
  };

  const openCreateDialog = () => {
    if (!selectedDossierId) {
      setError('Veuillez sélectionner un dossier');
      return;
    }
    resetForm();
    setEditingPaiement(null);
    setDialogOpen(true);
  };

  const openEditDialog = (paiement: Paiement) => {
    setFormData({
      montant: paiement.montant || 0,
      dateVersement: paiement.dateVersement || '',
      datePaiement: paiement.datePaiement || '',
      typePaiement: paiement.typePaiement || TypePaiement.PENSION,
      reference: paiement.reference || '',
      statut: paiement.statut || 'EN_ATTENTE',
      dossierId: selectedDossierId,
    });
    setEditingPaiement(paiement);
    setDialogOpen(true);
  };

  const getTypeLabel = (type: TypePaiement) => {
    switch (type) {
      case TypePaiement.PENSION:
        return 'Pension';
      default:
        return type;
    }
  };

  const getStatutColor = (statut: string) => {
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

  if (loading && !selectedDossierId) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PaymentIcon color="primary" />
          Gestion des Paiements
        </Typography>
      </Box>

      {/* Sélection du dossier */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Sélectionner un dossier
        </Typography>
        <Autocomplete
          options={dossiers}
          value={selectedDossier}
          onChange={(event, newValue) => {
            setSelectedDossier(newValue);
            setSelectedDossierId(newValue ? newValue.id || null : null);
          }}
          getOptionLabel={(option) =>
            `#${option.id} - ${option.numeroSecuriteSociale} - ${option.beneficiaire?.nom || ''} ${option.beneficiaire?.prenom || ''}`
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Choisir un dossier"
              placeholder="Sélectionnez un dossier pour voir ses paiements"
              fullWidth
            />
          )}
          sx={{ mb: 2 }}
        />
      </Paper>

      {selectedDossierId && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Paiements du dossier #{selectedDossierId}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreateDialog}
            >
              Ajouter un paiement
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Diagramme en barres des paiements par type */}
              <Box sx={{ mb: 3, bgcolor: '#222', p: 2, borderRadius: 2 }}>
                <PaiementBarChart data={getPaiementTypeStats(paiements)} />
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date de versement</TableCell>
                      <TableCell>Montant</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Référence</TableCell>
                      <TableCell>Statut</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paiements.map((paiement) => (
                      <TableRow key={paiement.id}>
                        <TableCell>
                          {paiement.dateVersement ? new Date(paiement.dateVersement).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {paiement.montant?.toLocaleString()} €
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getTypeLabel(paiement.typePaiement)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{paiement.reference || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip
                            label={paiement.statut || 'N/A'}
                            color={getStatutColor(paiement.statut || '')}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => {/* TODO: Redirection vers la fiche paiement */}}
                            size="small"
                          >
                            <PaymentIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {paiements.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="body2" color="text.secondary">
                            Aucun paiement trouvé pour ce dossier
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        {/* ...existing code... */}
        </>
      )}

      {/* Dialog d'ajout/modification */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPaiement ? 'Modifier le paiement' : 'Ajouter un paiement'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Montant (€)"
                type="number"
                value={formData.montant}
                onChange={(e) => setFormData({ ...formData, montant: Number(e.target.value) })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Type de paiement"
                value={formData.typePaiement}
                onChange={(e) => setFormData({ ...formData, typePaiement: e.target.value as TypePaiement })}
                fullWidth
                required
              >
                <MenuItem value={TypePaiement.PENSION}>Pension</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date de versement"
                type="date"
                value={formData.dateVersement}
                onChange={(e) => setFormData({ ...formData, dateVersement: e.target.value })}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date de paiement"
                type="date"
                value={formData.datePaiement}
                onChange={(e) => setFormData({ ...formData, datePaiement: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Référence"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Statut"
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                fullWidth
              >
                <MenuItem value="EN_ATTENTE">En attente</MenuItem>
                <MenuItem value="VALIDE">Validé</MenuItem>
                <MenuItem value="REJETE">Rejeté</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingPaiement ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaiementList;
