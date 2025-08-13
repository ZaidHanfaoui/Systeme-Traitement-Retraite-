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
import { Payment as PaymentIcon } from '@mui/icons-material';
import { TypePaiement, Paiement } from '../../types';
import { paiementService } from '../../services/api';

interface CreatePaiementProps {
  open: boolean;
  onClose: () => void;
  dossierId: number;
  paiement?: Paiement;
  isEdit?: boolean;
  onSuccess?: () => Promise<void>;
}

const CreatePaiement: React.FC<CreatePaiementProps> = ({
  open,
  onClose,
  dossierId,
  paiement,
  isEdit = false,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    montant: paiement?.montant?.toString() || '',
    dateVersement: paiement?.dateVersement || '',
    datePaiement: paiement?.datePaiement || '',
    typePaiement: paiement?.typePaiement || TypePaiement.PENSION ,
    reference: paiement?.reference || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!formData.montant || !formData.dateVersement || !formData.typePaiement) {
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

      const paiementData: Paiement = {
        montant: Number(formData.montant),
        dateVersement: formData.dateVersement,
        datePaiement: formData.datePaiement,
        typePaiement: formData.typePaiement,
        reference: formData.reference,
        statut: paiement?.statut || 'EN_ATTENTE',
        dossierId: dossierId,
        id: paiement?.id,
      };

      if (isEdit && paiement?.id) {
        await paiementService.updatePaiement(paiement.id, paiementData);
      } else {
        await paiementService.createPaiement(paiementData);
      }

      setFormData({
        montant: '',
        dateVersement: '',
        datePaiement: '',
        typePaiement: TypePaiement.PENSION,
        reference: '',
      });

      if (onSuccess) {
        await onSuccess();
      }

      onClose();
    } catch (error: any) {
      console.error('Erreur lors de la création/modification du paiement:', error);
      setError(error.response?.data?.message || 'Erreur lors de la création/modification du paiement');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        montant: '',
        dateVersement: '',
        datePaiement: '',
        typePaiement: TypePaiement.PENSION,
        reference: '',
      });
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
  <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#fff', color: 'inherit', boxShadow: 2 }}>
          <PaymentIcon sx={{ mr: 1 }} />
          Ajouter un paiement
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
              label="Montant (€)"
              type="number"
              value={formData.montant}
              onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
              required
              disabled={loading}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Type de paiement"
              value={formData.typePaiement}
              onChange={(e) => setFormData({ ...formData, typePaiement: e.target.value as TypePaiement })}
              required
              disabled={loading}
            >
            <MenuItem value={TypePaiement.PENSION}>Pension</MenuItem>
            <MenuItem value={TypePaiement.ALLOCATION}>Allocation</MenuItem>
            <MenuItem value={TypePaiement.SUPPLEMENT}>Supplément</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date de versement"
              type="date"
              value={formData.dateVersement}
              onChange={(e) => setFormData({ ...formData, dateVersement: e.target.value })}
              required
              disabled={loading}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date de paiement"
              type="date"
              value={formData.datePaiement}
              onChange={(e) => setFormData({ ...formData, datePaiement: e.target.value })}
              disabled={loading}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Référence (optionnelle)"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              disabled={loading}
              placeholder="Numéro de référence du paiement"
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
          startIcon={<PaymentIcon />}
        >
          {loading ? 'Création...' : 'Ajouter Paiement'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePaiement;
