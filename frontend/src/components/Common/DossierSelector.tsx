import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { dossierService } from '../../services/api';
import { DossierRetraite, DossierSelectorProps } from '../../types';

const DossierSelector: React.FC<DossierSelectorProps> = ({
  selectedDossierId,
  onDossierChange,
  label,
  placeholder,
}) => {
  const [dossiers, setDossiers] = useState<DossierRetraite[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadDossiers = async () => {
    try {
      setLoading(true);
      const response = await dossierService.getAllDossiers();
      setDossiers(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des dossiers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDossiers();
  }, []);

  const filteredDossiers = dossiers.filter(dossier =>
    dossier.numeroSecuriteSociale?.includes(searchTerm) ||
    dossier.beneficiaire?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dossier.beneficiaire?.prenom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedDossier = dossiers.find(d => d.id === selectedDossierId) || null;

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {label}
      </Typography>

      <Autocomplete
        value={selectedDossier}
        onChange={(event, newValue) => {
          onDossierChange(newValue ? newValue.id || null : null);
        }}
        inputValue={searchTerm}
        onInputChange={(event, newInputValue) => {
          setSearchTerm(newInputValue);
        }}
        options={filteredDossiers}
        getOptionLabel={(option) =>
          `${option.numeroSecuriteSociale} - ${option.beneficiaire?.nom || ''} ${option.beneficiaire?.prenom || ''}`
        }
        loading={loading}
        fullWidth
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder || "Tapez le numéro SS ou le nom du bénéficiaire..."}
            variant="outlined"
          />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            <Box>
              <Typography variant="body1">
                <strong>{option.numeroSecuriteSociale}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {option.beneficiaire?.nom} {option.beneficiaire?.prenom}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Statut: {option.statut} | Créé le: {option.dateCreation ? new Date(option.dateCreation).toLocaleDateString() : 'N/A'}
              </Typography>
            </Box>
          </Box>
        )}
        noOptionsText="Aucun dossier trouvé"
        loadingText="Chargement des dossiers..."
      />

      {selectedDossier && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2">Dossier sélectionné:</Typography>
          <Typography variant="body2">
            <strong>N° SS:</strong> {selectedDossier.numeroSecuriteSociale}
          </Typography>
          <Typography variant="body2">
            <strong>Bénéficiaire:</strong> {selectedDossier.beneficiaire?.nom} {selectedDossier.beneficiaire?.prenom}
          </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> {selectedDossier.beneficiaire?.email}
          </Typography>
          <Typography variant="body2">
            <strong>Statut:</strong> {selectedDossier.statut}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default DossierSelector;
