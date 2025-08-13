import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  LinearProgress,
  Alert,
  Box,
  Typography,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { documentService } from '../../services/api';
import { Document } from '../../types';

interface CreateDocumentProps {
  open: boolean;
  onClose: () => void;
  dossierId?: number;
  document?: Document;
  isEdit?: boolean;
  onSuccess?: () => Promise<void>;
}

const CreateDocument: React.FC<CreateDocumentProps> = ({
  open,
  onClose,
  dossierId,
  document,
  isEdit = false,
  onSuccess
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState(document?.description ?? '');
  const [nom, setNom] = useState(document?.nom ?? '');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (isEdit && document) {
      // Edition
      try {
        setUploading(true);
        setError(null);
        await documentService.updateDocument(document.id ?? 0, { nom, description });
        if (onSuccess) await onSuccess();
        onClose();
      } catch (error: any) {
        setError('Erreur lors de la modification');
      } finally {
        setUploading(false);
      }
      return;
    }
    // Création
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier');
      return;
    }
    if (!dossierId) {
      setError('ID du dossier manquant');
      return;
    }
    // Vérification taille max 10 Mo (ajuste selon backend)
    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError('Le fichier est trop volumineux (max 10 Mo)');
      return;
    }
    try {
      setUploading(true);
      setError(null);
      setUploadProgress(30);
      // Construction du FormData
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (description) formData.append('description', description);
      // Appel API direct (bypass documentService si bug)
      const res = await fetch(`http://localhost:8088/api/documents/upload/${dossierId}`, {
        method: 'POST',
        body: formData,
      });
      setUploadProgress(80);
      if (!res.ok) {
        const errMsg = await res.text();
        setError(errMsg || 'Erreur lors de l\'upload du document');
        setUploading(false);
        setUploadProgress(0);
        return;
      }
      setUploadProgress(100);
      setSelectedFile(null);
      setDescription('');
      setUploadProgress(0);
      if (onSuccess) await onSuccess();
      onClose();
    } catch (error: any) {
      setError('Erreur technique lors de l\'upload');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setSelectedFile(null);
      setDescription('');
      setNom('');
      setError(null);
      setUploadProgress(0);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CloudUploadIcon sx={{ mr: 1 }} />
          {isEdit ? 'Modifier le document' : 'Ajouter un document'}
        </Box>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {isEdit ? (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom du fichier"
                  value={nom}
                  onChange={e => setNom(e.target.value)}
                  disabled={uploading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  disabled={uploading}
                />
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ height: '100px', borderStyle: 'dashed' }}
                  disabled={uploading}
                >
                  {selectedFile ? (
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1">{selectedFile.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center' }}>
                      <CloudUploadIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography>Cliquez pour sélectionner un fichier</Typography>
                    </Box>
                  )}
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  />
                </Button>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description (optionnelle)"
                  multiline
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={uploading}
                  placeholder="Décrivez le contenu de ce document..."
                />
              </Grid>

              {uploading && (
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Upload en cours... {uploadProgress}%
                    </Typography>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                  </Box>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isEdit ? uploading : !selectedFile || uploading}
          startIcon={uploading ? null : <CloudUploadIcon />}
        >
          {uploading ? (isEdit ? 'Modification...' : 'Upload...') : (isEdit ? 'Enregistrer' : 'Ajouter Document')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDocument;
