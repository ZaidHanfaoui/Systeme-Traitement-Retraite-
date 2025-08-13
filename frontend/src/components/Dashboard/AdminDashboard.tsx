import React, { useState, useEffect } from 'react';
import Sidebar from '../Layout/Sidebar';
import Navbar from '../Layout/Navbar';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
  Chip,
  IconButton,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import BarChartIcon from '@mui/icons-material/BarChart';
import WorkIcon from '@mui/icons-material/Work';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../contexts/AuthContext';
import { dossierService, paiementService } from '../../services/api';
import DossierList from '../Dossiers/DossierList';
import PaiementList from '../Paiements/PaiementList';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState({ dossiers: 0, utilisateurs: 0, paiements: 0, montantTotal: 0, enAttente: 0, rejetes: 0 });
  const [recentDossiers, setRecentDossiers] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dossiersRes = await dossierService.getAllDossiers();
        const paiementsRes = await paiementService.getAllPaiements();
        const dossiers = dossiersRes.data || [];
        const paiements = paiementsRes.data || [];

        setStats({
          dossiers: dossiers.length,
          utilisateurs: dossiers.length,
          paiements: paiements.length,
          montantTotal: paiements.reduce((sum, p) => sum + (p.montant || 0), 0),
          enAttente: dossiers.filter(d => d.statut === 'VALIDE').length,
          rejetes: dossiers.filter(d => d.statut === 'REJETE').length
        });
        setRecentDossiers(
          dossiers.slice(-3).map(d => ({
            id: d.id,
            beneficiaire: d.beneficiaire ? `${d.beneficiaire.nom} ${d.beneficiaire.prenom}` : '',
            statut: d.statut
          }))
        );
      } catch (e) {
        setError('Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#fff' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
  <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fff', color: 'inherit' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Navbar user={user} onLogout={logout} toggleMode={() => {}} mode="dark" />
        <Box sx={{ p: 3 }}>
                   <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <img src="/logo-cimr.png" alt="CIMR Logo" style={{ height: '80px' }} />
      </div>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
            Tableau de bord administrateur <span role="img" aria-label="tool">🛠️</span>
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Gérez l'ensemble du système de retraite et supervisez toutes les activités
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={2}>
              <Card sx={{ bgcolor: '#fff', color: 'primary.main', boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h5">{stats.dossiers}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <FolderIcon sx={{ mr: 1 }} />
                    <Typography>Dossiers totaux</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card sx={{ bgcolor: '#fff', color: 'primary.main', boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h5">{stats.utilisateurs}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <PeopleIcon sx={{ mr: 1 }} />
                    <Typography>Utilisateurs (dossiers)</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card sx={{ bgcolor: '#fff', color: 'primary.main', boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h5">{stats.paiements}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <PaymentIcon sx={{ mr: 1 }} />
                    <Typography>Paiements</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card sx={{ bgcolor: '#fff', color: 'warning.main', boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h5">{stats.montantTotal.toLocaleString()}€</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <BarChartIcon sx={{ mr: 1 }} />
                    <Typography>Montant total</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card sx={{ bgcolor: '#fff', color: 'success.main', boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h5">{stats.enAttente}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <WorkIcon sx={{ mr: 1 }} />
                    <Typography>Validés</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card sx={{ bgcolor: '#fff', color: 'error.main', boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h5">{stats.rejetes}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <WorkIcon sx={{ mr: 1 }} />
                    <Typography>Rejetés</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="inherit" indicatorColor="primary">
              <Tab label="VUE D'ENSEMBLE" />
              <Tab label="GESTION DES DOSSIERS" />
              <Tab label="GESTION DES PAIEMENTS" />
              <Tab label="ACTIONS RAPIDES" />
            </Tabs>
          </Box>
          {tab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: '#fff', color: 'inherit', mb: 2, boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Répartition des dossiers par statut</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h4">{stats.dossiers - stats.rejetes - stats.enAttente}</Typography>
                        <Chip label="EN COURS" color="warning" />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h4">{stats.enAttente}</Typography>
                        <Chip label="VALIDE" color="success" />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h4">{stats.rejetes}</Typography>
                        <Chip label="REJETE" color="error" />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={8}>
                <Card sx={{ bgcolor: '#fff', color: 'inherit', boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Dossiers récents</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box component="table" sx={{ width: '100%' }}>
                      <Box component="thead">
                        <Box component="tr" sx={{ bgcolor: '#f5f5f5' }}>
                          <Box component="th" sx={{ p: 1 }}>ID</Box>
                          <Box component="th" sx={{ p: 1 }}>Bénéficiaire</Box>
                          <Box component="th" sx={{ p: 1 }}>Statut</Box>
                          <Box component="th" sx={{ p: 1 }}>Actions</Box>
                        </Box>
                      </Box>
                      <Box component="tbody">
                        {recentDossiers.map((dossier) => (
                          <Box component="tr" key={dossier.id}>
                            <Box component="td" sx={{ p: 1 }}>#{dossier.id}</Box>
                            <Box component="td" sx={{ p: 1 }}>{dossier.beneficiaire}</Box>
                            <Box component="td" sx={{ p: 1 }}>
                              {dossier.statut === 'VALIDE' ? (
                                <Chip label={dossier.statut} color="success" />
                              ) : dossier.statut === 'REJETE' ? (
                                <Chip label={dossier.statut} color="error" />
                              ) : (
                                <Chip label={dossier.statut} color="warning" />
                              )}
                            </Box>
                            <Box component="td" sx={{ p: 1, display: 'flex', gap: 1 }}>
                              <IconButton color="inherit" aria-label="voir" onClick={() => navigate(`/dossiers/${dossier.id}`)}>
                                <VisibilityIcon />
                              </IconButton>
                              <IconButton color="primary" aria-label="modifier" disabled>
                                <EditIcon />
                              </IconButton>
                              <IconButton color="error" aria-label="supprimer" disabled>
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
          {tab === 1 && (
            <Box sx={{ bgcolor: '#fff', p: 2, borderRadius: 2, boxShadow: 2 }}>
              <DossierList />
            </Box>
          )}
          {tab === 2 && (
            <Box sx={{ bgcolor: '#fff', p: 2, borderRadius: 2, boxShadow: 2 }}>
              <PaiementList />
            </Box>
          )}

          {tab === 3 && (
            <Box sx={{ bgcolor: '#fff', p: 2, borderRadius: 2, minHeight: 180, boxShadow: 2 }}>
              <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 600, mb: 2 }}>Actions rapides</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none' }}
                  onClick={() => setTab(1)}
                >
                  Voir les dossiers
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none' }}
                  onClick={() => setTab(2)}
                >
                  Consulter les paiements
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none' }}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Analyser les carrières
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ fontWeight: 600, borderRadius: 2, textTransform: 'none' }}
                  onClick={() => navigate('/documents')}
                >
                  Gérer les documents
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
