import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Folder as FolderIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  AdminPanelSettings as AdminIcon,
  ChevronLeft as ChevronLeftIcon,
  Work as WorkIcon,
  Description as DocumentIcon,
} from '@mui/icons-material';

const drawerWidth = 260;

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const adminMenuItems = [
    { text: 'Dashboard Admin', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Gestion des Dossiers', icon: <FolderIcon />, path: '/dossiers' },
    { text: 'Gestion des Carrières', icon: <WorkIcon />, path: '/carrieres' },
    { text: 'Gestion des Paiements', icon: <PaymentIcon />, path: '/paiements' },
    { text: 'Gestion des Documents', icon: <DocumentIcon />, path: '/documents' },
    { text: 'Gestion des Utilisateurs', icon: <PeopleIcon />, path: '/users' },
    { text: 'Configuration', icon: <SettingsIcon />, path: '/settings' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1e3a8a',
          color: 'white',
        },
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', pr: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <AdminIcon sx={{ color: '#fbbf24' }} />
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
            Administration
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
      <List>
        {adminMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path || location.pathname.startsWith(item.path + '/')}
              onClick={() => handleNavigate(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.9rem',
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 'auto', p: 2 }}>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          Interface d'administration
        </Typography>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;
