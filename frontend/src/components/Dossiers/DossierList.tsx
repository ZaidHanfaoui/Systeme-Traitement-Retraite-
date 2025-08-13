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
  IconButton,
  Chip,
  TextField,
  Grid,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { dossierService } from '../../services/api';
import { DossierRetraite, StatutDossier } from '../../types';
import CreateDossier from './CreateDossier';
import FloatingChatbot from '../Chatbot/FloatingChatbot';

const DossierList: React.FC = () => {
  const navigate = useNavigate();
  const [dossiers, setDossiers] = useState<DossierRetraite[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState<string>('');
  const [createDossierOpen, setCreateDossierOpen] = useState(false);
  // Nouveaux états pour la modification
  const [editingDossier, setEditingDossier] = useState<DossierRetraite | null>(null);
  const [editDossierOpen, setEditDossierOpen] = useState(false);

  useEffect(() => {
    loadDossiers();
  }, []);

  const loadDossiers = async () => {
    try {
      setLoading(true);
      const response = await dossierService.getAllDossiers();
      setDossiers(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des dossiers:', error);
      setDossiers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce dossier ?')) {
      try {
        await dossierService.deleteDossier(id);
        await loadDossiers();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const getStatutColor = (statut: StatutDossier): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (statut) {
      case StatutDossier.EN_COURS:
        return 'warning';
      case StatutDossier.VALIDE:
        return 'success';
      case StatutDossier.REJETE:
        return 'error';
      case StatutDossier.BROUILLON:
        return 'default';
      default:
        return 'default';
    }
  };

  const getFilteredDossiers = () => {
    let filtered = [...dossiers];

    // Filtre par statut
    if (statutFilter) {
      filtered = filtered.filter(d => d.statut === statutFilter);
    }

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(d =>
        d.numeroSecuriteSociale?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.beneficiaire?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.beneficiaire?.prenom?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredDossiers = getFilteredDossiers();

  if (loading) {
    return <Typography>Chargement des dossiers...</Typography>;
  }

  return (
  <Box sx={{ p: 3, bgcolor: '#fff', color: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <img src="/logo-cimr.png" alt="CIMR Logo" style={{ height: '80px' }} />
      </div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Gestion des dossiers
  </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDossierOpen(true)}
        >
          Nouveau dossier
        </Button>
      </Box>

      {/* Filtres */}
  <Paper sx={{ p: 2, mb: 3, bgcolor: '#fff', color: 'inherit', boxShadow: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Rechercher un dossier"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" />,
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Filtrer par statut"
              value={statutFilter}
              onChange={(e) => setStatutFilter(e.target.value)}
              size="small"
            >
              <MenuItem value="">Tous les statuts</MenuItem>
              <MenuItem value={StatutDossier.BROUILLON}>Brouillon</MenuItem>
              <MenuItem value={StatutDossier.EN_COURS}>En cours</MenuItem>
              <MenuItem value={StatutDossier.VALIDE}>Validé</MenuItem>
              <MenuItem value={StatutDossier.REJETE}>Rejeté</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {filteredDossiers.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            Aucun dossier trouvé
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>N° Sécurité Sociale</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDossiers.map((dossier, index) => (
                <TableRow key={dossier.id || `dossier-${index}`}>
                  <TableCell>{dossier.id || 'N/A'}</TableCell>
                  <TableCell>{dossier.numeroSecuriteSociale}</TableCell>
                  <TableCell>
                    {dossier.beneficiaire ? `${dossier.beneficiaire.nom} ${dossier.beneficiaire.prenom}` : 'Non renseigné'}
                  </TableCell>
                  <TableCell>{dossier.beneficiaire?.email || 'Non renseigné'}</TableCell>
                  <TableCell>
                    <Chip
                      label={dossier.statut}
                      color={getStatutColor(dossier.statut)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/dossiers/${dossier.id}`)}
                      disabled={!dossier.id}
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(dossier.id!)}
                      disabled={!dossier.id}
                      title="Supprimer le dossier"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog pour créer un nouveau dossier */}
      <CreateDossier
        open={createDossierOpen}
        onClose={() => setCreateDossierOpen(false)}
        onDossierCreated={loadDossiers}
      />

      {/* Dialog pour éditer un dossier */}
      <CreateDossier
        open={editDossierOpen}
        onClose={() => {
          setEditDossierOpen(false);
          setEditingDossier(null);
        }}
        onDossierCreated={loadDossiers}
        dossier={editingDossier || undefined}
        isEdit={true}
      />

      {/* Chatbot flottant */}
      <FloatingChatbot />
    </Box>
  );
};

export default DossierList;
