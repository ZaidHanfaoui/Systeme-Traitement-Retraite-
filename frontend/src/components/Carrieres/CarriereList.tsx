import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Work,
} from '@mui/icons-material';
import { Carriere, RegimeRetraite, DossierRetraite } from '../../types';
import { carriereService, dossierService } from '../../services/api';

interface CarriereListProps {
  dossierId?: number;
}

const CarriereList: React.FC<CarriereListProps> = ({ dossierId }) => {
  const [carrieres, setCarrieres] = useState<Carriere[]>([]);
  const [dossiers, setDossiers] = useState<DossierRetraite[]>([]);
  const [selectedDossier, setSelectedDossier] = useState<DossierRetraite | null>(null);
  const [selectedDossierId, setSelectedDossierId] = useState<number | null>(dossierId || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCarriere, setEditingCarriere] = useState<Carriere | null>(null);
  const [formData, setFormData] = useState({
    entreprise: '',
    poste: '',
    dateDebut: '',
    dateFin: '',
    salaireMoyen: 0,
    regimeRetraite: RegimeRetraite.GENERAL,
    trimestresValides: 0,
    dossierId: null as number | null,
  });

  useEffect(() => {
    loadDossiers();
  }, []);

  useEffect(() => {
    if (selectedDossierId) {
      loadCarrieres();
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

  const loadCarrieres = async () => {
    if (!selectedDossierId) return;

    try {
      setLoading(true);
      const response = await carriereService.getCarrieresByDossier(selectedDossierId);
      setCarrieres(response.data || []);
      setError(null);
    } catch (error) {
      console.error('Erreur lors du chargement des carrières:', error);
      setError('Erreur lors du chargement des carrières');
      setCarrieres([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDossierId) {
      setError('Veuillez sélectionner un dossier');
      return;
    }

    if (!formData.entreprise || !formData.poste || !formData.dateDebut) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setError(null);

      const carriereData = {
        entreprise: formData.entreprise,
        poste: formData.poste,
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin || undefined,
        salaireMoyen: Number(formData.salaireMoyen),
        regimeRetraite: formData.regimeRetraite,
        trimestresValides: Number(formData.trimestresValides),
        dossierId: selectedDossierId,
      };

      if (editingCarriere && editingCarriere.id) {
        await carriereService.updateCarriere(editingCarriere.id, carriereData);
      } else {
        await carriereService.createCarriere(selectedDossierId, carriereData);
      }

      setDialogOpen(false);
      setEditingCarriere(null);
      resetForm();
      await loadCarrieres();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError('Erreur lors de la sauvegarde de la carrière');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette carrière ?')) {
      try {
        await carriereService.deleteCarriere(id);
        await loadCarrieres();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError('Erreur lors de la suppression de la carrière');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      entreprise: '',
      poste: '',
      dateDebut: '',
      dateFin: '',
      salaireMoyen: 0,
      regimeRetraite: RegimeRetraite.GENERAL,
      trimestresValides: 0,
      dossierId: selectedDossierId,
    });
  };

  const openCreateDialog = () => {
    if (!selectedDossierId) {
      setError('Veuillez sélectionner un dossier');
      return;
    }
    resetForm();
    setEditingCarriere(null);
    setDialogOpen(true);
  };

  const openEditDialog = (carriere: Carriere) => {
    setFormData({
      entreprise: carriere.entreprise || '',
      poste: carriere.poste || '',
      dateDebut: carriere.dateDebut || '',
      dateFin: carriere.dateFin || '',
      salaireMoyen: carriere.salaireMoyen || 0,
      regimeRetraite: carriere.regimeRetraite || RegimeRetraite.GENERAL,
      trimestresValides: carriere.trimestresValides || 0,
      dossierId: selectedDossierId,
    });
    setEditingCarriere(carriere);
    setDialogOpen(true);
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
          <Work color="primary" />
          Gestion des Carrières
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
              placeholder="Sélectionnez un dossier pour voir ses carrières"
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
              Carrières du dossier #{selectedDossierId}
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={openCreateDialog}
            >
              Ajouter une carrière
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
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Entreprise</TableCell>
                    <TableCell>Poste</TableCell>
                    <TableCell>Période</TableCell>
                    <TableCell>Salaire Moyen</TableCell>
                    <TableCell>Régime</TableCell>
                    <TableCell>Trimestres</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {carrieres.map((carriere) => (
                    <TableRow key={carriere.id}>
                      <TableCell>{carriere.entreprise}</TableCell>
                      <TableCell>{carriere.poste}</TableCell>
                      <TableCell>
                        {carriere.dateDebut ? new Date(carriere.dateDebut).toLocaleDateString() : 'N/A'} -
                        {carriere.dateFin ? new Date(carriere.dateFin).toLocaleDateString() : 'En cours'}
                      </TableCell>
                      <TableCell>
                        {carriere.salaireMoyen?.toLocaleString()} €
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={carriere.regimeRetraite}
                          color={getRegimeColor(carriere.regimeRetraite)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{carriere.trimestresValides}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => openEditDialog(carriere)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => carriere.id && handleDelete(carriere.id)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {carrieres.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body2" color="text.secondary">
                          Aucune carrière trouvée pour ce dossier
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {/* Dialog d'ajout/modification */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCarriere ? 'Modifier la carrière' : 'Ajouter une carrière'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Entreprise"
                value={formData.entreprise}
                onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Poste"
                value={formData.poste}
                onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Date de début"
                type="date"
                value={formData.dateDebut}
                onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Date de fin"
                type="date"
                value={formData.dateFin}
                onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Salaire moyen annuel (€)"
                type="number"
                value={formData.salaireMoyen}
                onChange={(e) => setFormData({ ...formData, salaireMoyen: Number(e.target.value) })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Régime de retraite"
                value={formData.regimeRetraite}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    regimeRetraite: e.target.value as RegimeRetraite,
                  })
                }
                fullWidth
                required
              >
                <MenuItem value={RegimeRetraite.GENERAL}>Régime général</MenuItem>
                <MenuItem value={RegimeRetraite.FONCTION_PUBLIQUE}>Fonction publique</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Trimestres validés"
                type="number"
                value={formData.trimestresValides}
                onChange={(e) => setFormData({ ...formData, trimestresValides: Number(e.target.value) })}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCarriere ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CarriereList;
