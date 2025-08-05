// src/pages/Dashboard/DashboardPage/index.tsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';

import Sidebar from '../../../components/Dashboard/Sidebar';
import Navbar from '../../../components/Dashboard/Navbar';

const drawerWidth = 240;

const DashboardLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          mt: 1,
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <Navbar handleDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth} />
        
        {/* Container padrão para padronizar o espaçamento do conteúdo */}
        <Container
          maxWidth="lg"
          sx={{
            flex: 1,
            py: 2,
            px: { xs: 1, sm: 2 },
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Outlet />
        </Container>
      </Box>
    </>
  );
};

export default DashboardLayout;
