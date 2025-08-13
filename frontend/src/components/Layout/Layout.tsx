import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Box } from '@mui/material';
import FloatingChatbot from '../Chatbot/FloatingChatbot';

const Layout: React.FC<{ children: React.ReactNode; toggleMode?: () => void; mode?: 'light' | 'dark' }> = ({ children, toggleMode, mode }) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar user={null} onLogout={async () => {}} toggleMode={toggleMode} mode={mode} />
      <Sidebar />
      <Box sx={{ mt: 8, ml: { xs: 0, md: 0 } }}>
        {children}
      </Box>
      <FloatingChatbot />
    </Box>
  );
};

export default Layout;
