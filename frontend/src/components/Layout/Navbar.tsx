
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Button, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';

const Navbar: React.FC<{ user: User | null; onLogout: () => Promise<void>; toggleMode?: () => void; mode?: 'light' | 'dark' }> = ({ user, onLogout, toggleMode, mode }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleQuickAction = (route: string) => {
    navigate(route);
    handleClose();
  };

  const handleLogout = async () => {
    await onLogout();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Home Button */}
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => navigate('/') }>
          <MenuIcon />
        </IconButton>
        {/* App Title */}
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/') }>
          Système Retraite
        </Typography>
        {/* Theme Toggle Button */}
        {toggleMode && (
          <Tooltip title={mode === 'dark' ? 'Mode clair' : 'Mode sombre'}>
            <IconButton color="inherit" onClick={toggleMode} sx={{ mr: 1 }}>
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        )}
        {/* Quick Actions Menu */}
        <IconButton color="inherit" onClick={handleMenu} aria-label="actions rapides" sx={{ mr: 1 }}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={() => handleQuickAction('/analyse-systeme')}>Analyse Système</MenuItem>
          <MenuItem onClick={() => handleQuickAction('/dossiers')}>Dossiers</MenuItem>
          <MenuItem onClick={() => handleQuickAction('/carrieres')}>Carrières</MenuItem>
          <MenuItem onClick={() => handleQuickAction('/documents')}>Documents</MenuItem>
          <MenuItem onClick={() => handleQuickAction('/paiements')}>Paiements</MenuItem>
        </Menu>
        {/* User Info */}
        {user && (
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user.name || user.username}
          </Typography>
        )}
        {/* Logout Button */}
        <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ ml: 1 }}>
          Déconnexion
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
