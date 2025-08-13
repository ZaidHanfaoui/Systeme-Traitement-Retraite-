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
  Chip,
  Alert,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Download,
  Upload,
  Description,
} from '@mui/icons-material';
import { Document, DossierRetraite } from '../../types';
import { documentService, dossierService } from '../../services/api';

interface DocumentListProps {
  dossierId?: number;
}

const DocumentList: React.FC<DocumentListProps> = ({ dossierId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [dossiers, setDossiers] = useState<DossierRetraite[]>([]);
  const [selectedDossier, setSelectedDossier] = useState<DossierRetraite | null>(null);
  const [selectedDossierId, setSelectedDossierId] = useState<number | null>(dossierId || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    loadDossiers();
  }, []);

  useEffect(() => {
    if (selectedDossierId) {
      loadDocuments();
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

  const loadDocuments = async () => {
    if (!selectedDossierId) return;

    try {
      setLoading(true);
      const response = await documentService.getDocumentsByDossier(selectedDossierId);
      setDocuments(response.data || []);
      setError(null);
    } catch (error) {
      console.error('Erreur lors du chargement des documents:', error);
      setError('Erreur lors du chargement des documents');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedDossierId) {
      setError('Veuillez sélectionner un fichier et un dossier');
      return;
    }

    try {
      setError(null);
      setUploadProgress(0);

      // Simuler le progrès d'upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      await documentService.uploadDocument(selectedDossierId, selectedFile, description);

      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        setUploadDialogOpen(false);
        setSelectedFile(null);
        setDescription('');
        setUploadProgress(0);
        loadDocuments();
      }, 1000);

    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      setError('Erreur lors de l\'upload du document');
      setUploadProgress(0);
    }
  };

  const handleDownload = async (documentId: number, fileName: string) => {
    try {
      const response = await documentService.downloadDocument(documentId);

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      setError('Erreur lors du téléchargement du document');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      try {
        await documentService.deleteDocument(id);
        await loadDocuments();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError('Erreur lors de la suppression du document');
      }
    }
  };

  const openUploadDialog = () => {
    if (!selectedDossierId) {
      setError('Veuillez sélectionner un dossier');
      return;
    }
    setUploadDialogOpen(true);
  };

  const getFileTypeColor = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'error';
      case 'doc':
      case 'docx':
        return 'primary';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'success';
      default:
        return 'default';
    }
  };

  const getFileTypeIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return '🖼️';
      default:
        return '📎';
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
          <Description color="primary" />
          Gestion des Documents
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
              placeholder="Sélectionnez un dossier pour voir ses documents"
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
              Documents du dossier #{selectedDossierId}
            </Typography>
            <Button
              variant="contained"
              startIcon={<Upload />}
              onClick={openUploadDialog}
            >
              Ajouter un document
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
                    <TableCell>Nom du fichier</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Date d'upload</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Taille</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>{getFileTypeIcon(document.nom || '')}</span>
                          {document.nom}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={document.type || 'N/A'}
                          color={getFileTypeColor(document.nom || '')}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {document.dateUpload ? new Date(document.dateUpload).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>{document.description || '-'}</TableCell>
                      <TableCell>
                        {document.tailleFichier ? `${(document.tailleFichier / 1024).toFixed(1)} KB` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => document.id && document.nom && handleDownload(document.id, document.nom)}
                          size="small"
                          title="Télécharger"
                        >
                          <Download />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => document.id && handleDelete(document.id)}
                          size="small"
                          title="Supprimer"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {documents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="text.secondary">
                          Aucun document trouvé pour ce dossier
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

      {/* Dialog d'upload */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter un document</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <input
                accept="*/*"
                style={{ display: 'none' }}
                id="file-upload"
                type="file"
                onChange={handleFileSelect}
              />
              <label htmlFor="file-upload">
                <Button variant="outlined" component="span" fullWidth>
                  {selectedFile ? selectedFile.name : 'Choisir un fichier'}
                </Button>
              </label>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description (optionnelle)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Upload en cours: {uploadProgress}%
                </Typography>
                <div style={{
                  width: '100%',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '4px',
                  height: '8px'
                }}>
                  <div style={{
                    width: `${uploadProgress}%`,
                    backgroundColor: '#1976d2',
                    height: '100%',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!selectedFile || uploadProgress > 0}
          >
            {uploadProgress > 0 && uploadProgress < 100 ? 'Upload...' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentList;
