import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import PaiementBarChart from '../components/Paiements/PaiementBarChart';
import { Pie, Line, Radar, Doughnut } from 'react-chartjs-2';

// Données pour le diagramme circulaire
const pieData = {
  labels: ['Pension', 'Allocation', 'Supplément'],
  datasets: [
    {
      data: [60, 25, 15],
      backgroundColor: ['#43e97b', '#009688', '#ff9800'],
    },
  ],
};

// Données pour le diagramme linéaire
const lineData = {
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
  datasets: [
    {
      label: 'Montant total payé',
      data: [1200, 1500, 1100, 1800, 1700, 1600],
      borderColor: '#009688',
      backgroundColor: 'rgba(67,233,123,0.2)',
      fill: true,
    },
  ],
};

// Données pour le diagramme radar (comparaison des montants par type)
const radarData = {
  labels: ['Pension', 'Allocation', 'Supplément'],
  datasets: [
    {
      label: 'Montant moyen',
      data: [1200, 800, 400],
      backgroundColor: 'rgba(67,233,123,0.2)',
      borderColor: '#43e97b',
      pointBackgroundColor: '#009688',
    },
  ],
};

// Données pour le diagramme donut (statuts de paiement)
const donutData = {
  labels: ['En attente', 'Validé', 'Rejeté'],
  datasets: [
    {
      data: [10, 30, 5],
      backgroundColor: ['#ff9800', '#43e97b', '#e91e63'],
    },
  ],
};

const AnalyseSysteme: React.FC = () => {
  return (
  <Box sx={{ p: 4, bgcolor: 'background.default', color: 'text.primary' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <img src="/logo-cimr.png" alt="CIMR Logo" style={{ height: '80px' }} />
      </div>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Analyse Système
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ boxShadow: 3, borderRadius: 3, p: 3, bgcolor: '#fff' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Diagramme des paiements</Typography>
            <PaiementBarChart data={{ ALLOCATION: 800, SUPPLEMENT: 400 }} pension={1200} />
            <Button variant="outlined" sx={{ mt: 2 }} color="primary">Voir détails paiements</Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ boxShadow: 3, borderRadius: 3, p: 3, bgcolor: '#fff' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Répartition des types de paiement</Typography>
            <Pie data={pieData} />
            <Button variant="outlined" sx={{ mt: 2 }} color="primary">Voir détails répartition</Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ boxShadow: 3, borderRadius: 3, p: 3, bgcolor: '#fff', mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Comparaison des montants par type</Typography>
            <Radar data={radarData} />
            <Button variant="outlined" sx={{ mt: 2 }} color="primary">Voir détails comparaison</Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ boxShadow: 3, borderRadius: 3, p: 3, bgcolor: '#fff', mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Répartition des statuts de paiement</Typography>
            <Doughnut data={donutData} />
            <Button variant="outlined" sx={{ mt: 2 }} color="primary">Voir détails statuts</Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={12}>
          <Box sx={{ boxShadow: 3, borderRadius: 3, p: 3, bgcolor: '#fff', mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Évolution des paiements</Typography>
            <Line data={lineData} />
            <Button variant="outlined" sx={{ mt: 2 }} color="primary">Voir évolution complète</Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyseSysteme;
