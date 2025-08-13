import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Work as WorkIcon,
  Description as DocumentIcon,
  Payment as PaymentIcon,
  Calculate as CalculateIcon,
  ArrowBack as ArrowBackIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';
import { dossierService } from '../../services/api';
import { DossierRetraite, StatutDossier, CalculPensionResult } from '../../types';
import CarriereList from '../Carrieres/CarriereList';
import DocumentList from '../Documents/DocumentList';
import PaiementList from '../Paiements/PaiementList';
import FloatingChatbot from '../Chatbot/FloatingChatbot';

const DossierDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dossier, setDossier] = useState<DossierRetraite | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [pensionCalculee, setPensionCalculee] = useState<CalculPensionResult | null>(null);
  const [calculLoading, setCalculLoading] = useState(false);

  // États pour l'édition
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [statutDialogOpen, setStatutDialogOpen] = useState(false);
  const [newStatut, setNewStatut] = useState<StatutDossier>(StatutDossier.EN_COURS);

  useEffect(() => {
    if (id) {
      loadDossier();
    }
  }, [id]);

  const loadDossier = async () => {
    try {
      setLoading(true);
      const response = await dossierService.getDossierById(Number(id));
      setDossier(response.data);

      // Initialiser les données d'édition avec protection null safety
      const dossierData = response.data;
      setEditFormData({
        numeroSecuriteSociale: dossierData.numeroSecuriteSociale || '',
        nom: dossierData.beneficiaire?.nom || '',
        prenom: dossierData.beneficiaire?.prenom || '',
        email: dossierData.beneficiaire?.email || '',
        telephone: dossierData.beneficiaire?.telephone || '',
        dateNaissance: dossierData.beneficiaire?.dateNaissance || '',
        adresse: dossierData.beneficiaire?.adresse || '',
        statut: dossierData.statut || StatutDossier.EN_COURS
      });
    } catch (error) {
      console.error('Erreur lors du chargement du dossier:', error);
      // Rediriger vers la liste des dossiers si le dossier n'existe pas
      navigate('/dossiers');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculerPension = async () => {
    if (!dossier?.id) return;

    try {
      setCalculLoading(true);
      const response = await dossierService.calculatePension(dossier.id);
      setPensionCalculee({
        ...response.data,
        details: response.data.details ?? { salaireMoyenAnnuel: 0, trimestresValides: 0, tauxPension: 0 }
      });
    } catch (error) {
      console.error('Erreur lors du calcul de la pension:', error);
      // Calcul local de secours si l'API échoue
      calculerPensionLocal();
    } finally {
      setCalculLoading(false);
    }
  };

  // Calcul local de pension en cas d'échec de l'API
  const calculerPensionLocal = () => {
    if (!dossier?.carrieres || dossier.carrieres.length === 0) {
      setPensionCalculee({
        montant: 0,
        details: {
          salaireMoyenAnnuel: 0,
          trimestresValides: 0,
          tauxPension: 0,
        }
      });
      return;
    }

    const totalSalaires = dossier.carrieres.reduce((sum, carriere) => sum + carriere.salaireMoyen, 0);
    const salaireMoyenAnnuel = totalSalaires / dossier.carrieres.length;
    const trimestresValides = dossier.carrieres.reduce((sum, carriere) => sum + (carriere.trimestresValides || 0), 0);

    // Calcul simplifié du taux de pension (50% maximum)
    const tauxPension = Math.min(50, (trimestresValides / 172) * 50);
    const montant = (salaireMoyenAnnuel * tauxPension) / 100;

    setPensionCalculee({
      montant: Math.round(montant),
      details: {
        salaireMoyenAnnuel: Math.round(salaireMoyenAnnuel),
        trimestresValides,
        tauxPension: Math.round(tauxPension * 100) / 100,
      }
    });
  };

  const getStatutColor = (statut: StatutDossier) => {
    switch (statut) {
      case StatutDossier.EN_COURS:
        return 'warning';
      case StatutDossier.VALIDE:
        return 'success';
      case StatutDossier.REJETE:
        return 'error';
      default:
        return 'default';
    }
  };

  // Fonction pour modifier le statut
  const handleUpdateStatut = async () => {
    if (!dossier?.id) return;

    try {
      await dossierService.updateStatut(dossier.id, newStatut);
      setDossier({ ...dossier, statut: newStatut });
      setStatutDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  // Fonction pour modifier le dossier
  const handleUpdateDossier = async () => {
    if (!dossier?.id) return;

    try {
      const updatedData = {
        ...editFormData,
        beneficiaire: {
          ...dossier.beneficiaire,
          ...editFormData.beneficiaire
        }
      };

      const response = await dossierService.updateDossier(dossier.id, updatedData);
      setDossier(response.data);
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la modification du dossier:', error);
    }
  };

  // Ouvrir le dialog d'édition
  const openEditDialog = () => {
    setEditFormData({
      numeroSecuriteSociale: dossier?.numeroSecuriteSociale || '',
      beneficiaire: {
        nom: dossier?.beneficiaire?.nom || '',
        prenom: dossier?.beneficiaire?.prenom || '',
        email: dossier?.beneficiaire?.email || '',
        telephone: dossier?.beneficiaire?.telephone || '',
        adresse: dossier?.beneficiaire?.adresse || '',
        dateNaissance: dossier?.beneficiaire?.dateNaissance || ''
      }
    });
    setEditDialogOpen(true);
  };

  // Ouvrir le dialog de modification de statut
  const openStatutDialog = () => {
    setNewStatut(dossier?.statut || StatutDossier.EN_COURS);
    setStatutDialogOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement du dossier...</Typography>
      </Box>
    );
  }

  if (!dossier) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Dossier non trouvé
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/dossiers')}
          sx={{ mt: 2 }}
        >
          Retour à la liste des dossiers
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dossiers')}
            sx={{ mb: 2 }}
          >
            Retour à la liste
          </Button>
          <Typography variant="h4" gutterBottom>
            Dossier de retraite - {dossier.numeroSecuriteSociale}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<UpdateIcon />}
            onClick={() => {
              setNewStatut(dossier.statut);
              setStatutDialogOpen(true);
            }}
          >
            Modifier Statut
          </Button>
          <Button
            variant="outlined"
            startIcon={<CalculateIcon />}
            onClick={handleCalculerPension}
            disabled={calculLoading}
          >
            {calculLoading ? 'Calcul...' : 'Calculer Pension'}
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setEditDialogOpen(true)}
          >
            Modifier
          </Button>
        </Box>
      </Box>

      {/* Informations principales avec protection null safety */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Chip
                label={dossier.statut}
                color={getStatutColor(dossier.statut)}
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Créé le {dossier.dateCreation ? new Date(dossier.dateCreation).toLocaleDateString() : 'N/A'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Nom complet</Typography>
            <Typography variant="body1">
              {dossier.beneficiaire?.nom || 'N/A'} {dossier.beneficiaire?.prenom || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Email</Typography>
            <Typography variant="body1">{dossier.beneficiaire?.email || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Téléphone</Typography>
            <Typography variant="body1">{dossier.beneficiaire?.telephone || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Date de naissance</Typography>
            <Typography variant="body1">
              {dossier.beneficiaire?.dateNaissance
                ? new Date(dossier.beneficiaire.dateNaissance).toLocaleDateString()
                : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">Adresse</Typography>
            <Typography variant="body1">{dossier.beneficiaire?.adresse || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">Numéro de sécurité sociale</Typography>
            <Typography variant="body1">{dossier.numeroSecuriteSociale}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Résultat du calcul de pension */}
      {pensionCalculee && (
        <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
          <Typography variant="h6" gutterBottom color="primary">
            Calcul de Pension
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {pensionCalculee.montant.toLocaleString()} €
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pension mensuelle estimée
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">Détails du calcul :</Typography>
              {pensionCalculee.details && (
                <>
                  <Typography variant="body2">
                    • Salaire moyen annuel : {pensionCalculee.details.salaireMoyenAnnuel?.toLocaleString() || 'N/A'} €
                  </Typography>
                  <Typography variant="body2">
                    • Trimestres validés : {pensionCalculee.details.trimestresValides || 0}
                  </Typography>
                  <Typography variant="body2">
                    • Taux de pension : {pensionCalculee.details.tauxPension || 0}%
                  </Typography>
                </>
              )}
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Onglets */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
          <Tab icon={<WorkIcon />} label="Carrières" />
          <Tab icon={<DocumentIcon />} label="Documents" />
          <Tab icon={<PaymentIcon />} label="Paiements" />
        </Tabs>
      </Paper>

      {/* Contenu des onglets */}
      {currentTab === 0 && dossier.id && <CarriereList dossierId={dossier.id} />}
      {currentTab === 1 && dossier.id && <DocumentList dossierId={dossier.id} />}
      {currentTab === 2 && dossier.id && <PaiementList dossierId={dossier.id} />}

      {/* Chatbot flottant */}
      <FloatingChatbot />

      {/* Dialog pour modifier le statut */}
      <Dialog open={statutDialogOpen} onClose={() => setStatutDialogOpen(false)}>
        <DialogTitle>Modifier le statut du dossier</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Statut"
            value={newStatut}
            onChange={(e) => setNewStatut(e.target.value as StatutDossier)}
            sx={{ mt: 2 }}
          >
            <MenuItem value={StatutDossier.EN_COURS}>En cours</MenuItem>
            <MenuItem value={StatutDossier.VALIDE}>Validé</MenuItem>
            <MenuItem value={StatutDossier.REJETE}>Rejeté</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatutDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={async () => {
              try {
                if (dossier?.id) {
                  await dossierService.updateDossier(dossier.id, { statut: newStatut });
                  await loadDossier();
                  setStatutDialogOpen(false);
                }
              } catch (error) {
                console.error('Erreur lors de la mise à jour du statut:', error);
              }
            }}
            variant="contained"
          >
            Mettre à jour
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour éditer le dossier */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Modifier le dossier</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Numéro de sécurité sociale"
                value={editFormData.numeroSecuriteSociale || ''}
                onChange={(e) => setEditFormData({...editFormData, numeroSecuriteSociale: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Statut"
                value={editFormData.statut || StatutDossier.EN_COURS}
                onChange={(e) => setEditFormData({...editFormData, statut: e.target.value})}
              >
                <MenuItem value={StatutDossier.EN_COURS}>En cours</MenuItem>
                <MenuItem value={StatutDossier.VALIDE}>Validé</MenuItem>
                <MenuItem value={StatutDossier.REJETE}>Rejeté</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom"
                value={editFormData.nom || ''}
                onChange={(e) => setEditFormData({...editFormData, nom: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prénom"
                value={editFormData.prenom || ''}
                onChange={(e) => setEditFormData({...editFormData, prenom: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editFormData.email || ''}
                onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone"
                value={editFormData.telephone || ''}
                onChange={(e) => setEditFormData({...editFormData, telephone: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date de naissance"
                type="date"
                value={editFormData.dateNaissance || ''}
                onChange={(e) => setEditFormData({...editFormData, dateNaissance: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                multiline
                rows={3}
                value={editFormData.adresse || ''}
                onChange={(e) => setEditFormData({...editFormData, adresse: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={async () => {
              try {
                if (dossier?.id) {
                  const updateData = {
                    numeroSecuriteSociale: editFormData.numeroSecuriteSociale,
                    statut: editFormData.statut,
                    beneficiaire: {
                      nom: editFormData.nom,
                      prenom: editFormData.prenom,
                      email: editFormData.email,
                      telephone: editFormData.telephone,
                      dateNaissance: editFormData.dateNaissance,
                      adresse: editFormData.adresse
                    }
                  };
                  await dossierService.updateDossier(dossier.id, updateData);
                  await loadDossier();
                  setEditDialogOpen(false);
                }
              } catch (error) {
                console.error('Erreur lors de la mise à jour du dossier:', error);
              }
            }}
            variant="contained"
          >
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DossierDetail;
