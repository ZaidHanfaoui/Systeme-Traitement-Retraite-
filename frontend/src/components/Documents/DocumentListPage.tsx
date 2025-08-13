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
  Autocomplete,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { documentService, dossierService } from '../../services/api';
import { Document, DossierRetraite, DossierSelectorProps } from '../../types';
import DossierSelector from '../Common/DossierSelector';
import CreateDocument from './CreateDocument';
import FloatingChatbot from '../Chatbot/FloatingChatbot';

const DocumentListPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDossierId, setSelectedDossierId] = useState<number | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [createDocumentOpen, setCreateDocumentOpen] = useState(false);
  const [editDocument, setEditDocument] = useState<Document | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDossierId) {
      loadDocuments();
    } else {
      setDocuments([]);
    }
  }, [selectedDossierId]);

  const loadDocuments = async () => {
    if (!selectedDossierId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await documentService.getDocumentsByDossier(selectedDossierId);
      setDocuments(response.data || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des documents:', error);
      setError('Erreur lors du chargement des documents');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocument = async (documentId: number, fileName: string | undefined) => {
    if (!fileName) {
      setError('Nom de fichier manquant');
      return;
    }

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
    } catch (error: any) {
      console.error('Erreur lors du téléchargement:', error);
      setError('Erreur lors du téléchargement du document');
    }
  };

  const handleDeleteDocument = async (documentId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      return;
    }

    try {
      await documentService.deleteDocument(documentId);
      await loadDocuments();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression du document');
    }
  };

  const getFileTypeIcon = (fileName: string | undefined) => {
    if (!fileName) return '📁';
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
        return '📁';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    
  <Box sx={{ p: 3, bgcolor: '#fff', color: 'inherit' }}>
     {/* En-tête */}
     <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <img src="/logo-cimr.png" alt="CIMR Logo" style={{ height: '80px' }} />
      </div>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" gutterBottom>
          <DescriptionIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Gestion des Documents
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
        label="Sélectionner un dossier pour gérer ses documents"
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
              Documents du dossier sélectionné
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDocumentOpen(true)}
            >
              Ajouter un Document
            </Button>
          </Box>

          {/* Tableau des documents */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ bgcolor: '#fff', color: 'inherit', boxShadow: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Nom du Fichier</TableCell>
                    <TableCell>Date d'Upload</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Taille</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                          Aucun document trouvé pour ce dossier
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    documents.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>
                              {getFileTypeIcon(document.nom)}
                            </span>
                            <Typography variant="body2">
                              {document.type || 'Document'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {document.nom}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {document.dateUpload
                            ? new Date(document.dateUpload).toLocaleDateString()
                            : 'N/A'
                          }
                        </TableCell>
                        <TableCell>{document.description || '-'}</TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatFileSize(document.tailleFichier)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => setEditDocument(document)}
                            color="primary"
                            title="Modifier"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDownloadDocument(document.id!, document.nom)}
                            color="primary"
                            title="Télécharger"
                          >
                            <DownloadIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteDocument(document.id!)}
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
  <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#fff', color: 'inherit', boxShadow: 2 }}>
          <DescriptionIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Sélectionnez un dossier
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Veuillez sélectionner un dossier ci-dessus pour voir et gérer ses documents
          </Typography>
        </Paper>
      )}

      {/* Dialog de création */}
      {selectedDossierId && (
        <CreateDocument
          open={createDocumentOpen}
          onClose={() => setCreateDocumentOpen(false)}
          dossierId={selectedDossierId}
          onSuccess={loadDocuments}
        />
      )}
      {/* Dialog d'édition */}
      {editDocument && (
        <CreateDocument
          open={true}
          onClose={() => setEditDocument(null)}
          dossierId={typeof selectedDossierId === 'number' ? selectedDossierId : undefined}
          document={editDocument}
          isEdit={true}
          onSuccess={async () => {
            await loadDocuments();
            setEditDocument(null);
          }}
        />
      )}

      {/* Chatbot flottant */}
      <FloatingChatbot />
    </Box>
  );
};

export default DocumentListPage;
