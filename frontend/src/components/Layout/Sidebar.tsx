import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import DescriptionIcon from '@mui/icons-material/Description';
import PaymentIcon from '@mui/icons-material/Payment';
import MenuIcon from '@mui/icons-material/Menu';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleNavigate = (route: string) => {
    navigate(route);
    setOpen(false);
  };

  return (
    <>
      <IconButton color="inherit" onClick={() => setOpen(true)} sx={{ position: 'fixed', top: 16, left: 16, zIndex: 1300 }}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <List sx={{ width: 250 }}>
          <ListItem button onClick={() => handleNavigate('/dashboard')}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => handleNavigate('/dossiers')}>
            <ListItemIcon><AssessmentIcon /></ListItemIcon>
            <ListItemText primary="Dossiers" />
          </ListItem>
          <ListItem button onClick={() => handleNavigate('/carrieres')}>
            <ListItemIcon><WorkIcon /></ListItemIcon>
            <ListItemText primary="Carrières" />
          </ListItem>
          <ListItem button onClick={() => handleNavigate('/documents')}>
            <ListItemIcon><DescriptionIcon /></ListItemIcon>
            <ListItemText primary="Documents" />
          </ListItem>
          <ListItem button onClick={() => handleNavigate('/paiements')}>
            <ListItemIcon><PaymentIcon /></ListItemIcon>
            <ListItemText primary="Paiements" />
          </ListItem>
          <Divider />
          <ListItem button onClick={() => handleNavigate('/analyse-systeme')}>
            <ListItemIcon><AssessmentIcon /></ListItemIcon>
            <ListItemText primary="Analyse Système" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
