import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Alert,
  Box,
  Typography,
} from '@mui/material';
import { Work as WorkIcon } from '@mui/icons-material';
import { RegimeRetraite, Carriere } from '../../types';
import { carriereService } from '../../services/api';

interface CreateCarriereProps {
  open: boolean;
  onClose: () => void;
  dossierId: number;
  onSuccess?: () => Promise<void>;
}

const CreateCarriere: React.FC<CreateCarriereProps> = ({
  open,
  onClose,
  dossierId,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    entreprise: '',
    poste: '',
    dateDebut: '',
    dateFin: '',
    salaireMoyen: '',
    regimeRetraite: RegimeRetraite.GENERAL,
    trimestresValides: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!formData.entreprise || !formData.poste || !formData.dateDebut || !formData.salaireMoyen) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!dossierId) {
      setError('ID du dossier manquant');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const carriereData: Carriere = {
        entreprise: formData.entreprise,
        poste: formData.poste,
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin || undefined,
        salaireMoyen: Number(formData.salaireMoyen),
        regimeRetraite: formData.regimeRetraite,
        trimestresValides: Number(formData.trimestresValides) || 0,
        dossierId: dossierId,
      };

      console.log('Création de la carrière:', carriereData);

      await carriereService.createCarriere(dossierId, carriereData);

      // Réinitialiser le formulaire
      setFormData({
        entreprise: '',
        poste: '',
        dateDebut: '',
        dateFin: '',
        salaireMoyen: '',
        regimeRetraite: RegimeRetraite.GENERAL,
        trimestresValides: '',
      });

      // Appeler onSuccess si fourni
      if (onSuccess) {
        await onSuccess();
      }

      onClose();
    } catch (error: any) {
      console.error('Erreur lors de la création de la carrière:', error);
      setError(error.response?.data?.message || 'Erreur lors de la création de la carrière');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        entreprise: '',
        poste: '',
        dateDebut: '',
        dateFin: '',
        salaireMoyen: '',
        regimeRetraite: RegimeRetraite.GENERAL,
        trimestresValides: '',
      });
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <WorkIcon sx={{ mr: 1 }} />
          Ajouter une carrière
        </Box>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Entreprise"
              value={formData.entreprise}
              onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })}
              required
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Poste"
              value={formData.poste}
              onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
              required
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date de début"
              type="date"
              value={formData.dateDebut}
              onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date de fin"
              type="date"
              value={formData.dateFin}
              onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
              InputLabelProps={{ shrink: true }}
              helperText="Laissez vide si en cours"
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Salaire moyen annuel (€)"
              type="number"
              value={formData.salaireMoyen}
              onChange={(e) => setFormData({ ...formData, salaireMoyen: e.target.value })}
              required
              disabled={loading}
              inputProps={{ min: 0, step: 100 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Régime de retraite"
              value={formData.regimeRetraite}
              onChange={(e) => setFormData({ ...formData, regimeRetraite: e.target.value as RegimeRetraite })}
              required
              disabled={loading}
            >
              <MenuItem value={RegimeRetraite.GENERAL}>Régime Général</MenuItem>
              <MenuItem value={RegimeRetraite.FONCTION_PUBLIQUE}>Fonction Publique</MenuItem>
              <MenuItem value={RegimeRetraite.AGRICOLE}>Agricole</MenuItem>
              <MenuItem value={RegimeRetraite.LIBERAL}>Libéral</MenuItem>
              <MenuItem value={RegimeRetraite.COMPLEMENTAIRE}>Complémentaire</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Trimestres validés"
              type="number"
              value={formData.trimestresValides}
              onChange={(e) => setFormData({ ...formData, trimestresValides: e.target.value })}
              disabled={loading}
              inputProps={{ min: 0, max: 172 }}
              helperText="Nombre de trimestres validés pour cette carrière"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={<WorkIcon />}
        >
          {loading ? 'Création...' : 'Ajouter Carrière'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCarriere;
