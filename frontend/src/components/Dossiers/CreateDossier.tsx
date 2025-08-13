import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  MenuItem,
  Typography,
} from '@mui/material';
import {
  Cancel as CancelIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { dossierService } from '../../services/api';
import { DossierRetraite, StatutDossier, DossierFormProps } from '../../types';

const CreateDossier: React.FC<DossierFormProps> = ({
  open,
  onClose,
  onSuccess,
  onDossierCreated,
  dossier,
  isEdit = false
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    numeroSecuriteSociale: '',
    nom: '',
    prenom: '',
    dateNaissance: '',
    adresse: '',
    telephone: '',
    email: '',
    statut: StatutDossier.EN_COURS // Ajout du champ statut
  });

  // Charger les données du dossier en mode modification
  useEffect(() => {
    if (isEdit && dossier) {
      setFormData({
        numeroSecuriteSociale: dossier.numeroSecuriteSociale || '',
        nom: dossier.beneficiaire?.nom || '',
        prenom: dossier.beneficiaire?.prenom || '',
        dateNaissance: dossier.beneficiaire?.dateNaissance || '',
        adresse: dossier.beneficiaire?.adresse || '',
        telephone: dossier.beneficiaire?.telephone || '',
        email: dossier.beneficiaire?.email || '',
        statut: dossier.statut || StatutDossier.EN_COURS
      });
    }
  }, [isEdit, dossier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.numeroSecuriteSociale || !formData.nom || !formData.prenom) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const dossierData: DossierRetraite = {
        numeroSecuriteSociale: formData.numeroSecuriteSociale,
        beneficiaire: {
          nom: formData.nom,
          prenom: formData.prenom,
          dateNaissance: formData.dateNaissance,
          adresse: formData.adresse,
          telephone: formData.telephone,
          email: formData.email
        },
        statut: formData.statut // Inclure le statut sélectionné
      };

      let response;
      if (isEdit && dossier?.id) {
        // Mode modification
        response = await dossierService.updateDossier(dossier.id, dossierData);
      } else {
        // Mode création
        response = await dossierService.createDossier(dossierData);
      }

      const handleSuccess = async () => {
        if (onSuccess) {
          await onSuccess();
        }
        if (onDossierCreated) {
          await onDossierCreated();
        }
      };

      await handleSuccess();

      // Rediriger vers la liste des dossiers
      navigate('/dossiers');
      onClose();

    } catch (error) {
      console.error(`Erreur lors de ${isEdit ? 'la modification' : 'la création'} du dossier:`, error);
      setError(`Erreur lors de ${isEdit ? 'la modification' : 'la création'} du dossier. Veuillez réessayer.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">{isEdit ? 'Modifier' : 'Créer un nouveau'} dossier de retraite</Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Numéro de Sécurité Sociale"
                value={formData.numeroSecuriteSociale}
                onChange={(e) => setFormData({ ...formData, numeroSecuriteSociale: e.target.value })}
                fullWidth
                required
                placeholder="1 23 45 67 890 123 45"
                helperText="Format: 1 23 45 67 890 123 45"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Prénom"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Date de naissance"
                type="date"
                value={formData.dateNaissance}
                onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Téléphone"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Adresse"
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                fullWidth
                required
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Statut"
                select
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value as StatutDossier })}
                fullWidth
                required
              >
                {Object.values(StatutDossier).map((statut) => (
                  <MenuItem key={statut} value={statut}>
                    {statut}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            startIcon={<CancelIcon />}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : isEdit ? 'Modifier le dossier' : 'Créer le dossier'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateDossier;
