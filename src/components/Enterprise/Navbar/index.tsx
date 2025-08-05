import { useState, useEffect } from 'react';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Logo from '@/assets/img/firecloud-logo-branco-maior.png';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Button,
  Stack,
  styled,
  Avatar,
  Typography,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  Build as BuildIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  ContactMail as ContactMailIcon,
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  HowToReg as HowToRegIcon
} from '@mui/icons-material';

const StyledLink = styled(Link)(({ theme }) => ({
  marginLeft: theme.spacing(3),
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.secondary,
  fontWeight: 500,
  fontSize: '0.875rem',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    color: theme.palette.primary.main,
    transform: 'translateY(-1px)'
  },
  '&.active': {
    color: theme.palette.primary.main,
    fontWeight: 600
  }
}));

const PrimaryButton = styled(Button)(({ }) => ({
  fontWeight: 600,
  borderRadius: '8px',
  padding: '8px 20px',
  textTransform: 'none',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  }
})) as typeof Button;

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isAuthenticated, state } = useAuth();
  const user = state.data?.user;

  useEffect(() => {
    let prevScrollPos = window.pageYOffset;

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const scrollingDown = prevScrollPos < currentScrollPos;

      setIsVisible(!scrollingDown || currentScrollPos <= 50);
      setScrolled(currentScrollPos > 10);
      prevScrollPos = currentScrollPos;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    if (isAuthenticated()) {
      logout();
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown') {
      const keyboardEvent = event as React.KeyboardEvent;
      if (keyboardEvent.key === 'Tab' || keyboardEvent.key === 'Shift') {
        return;
      }
    }
    setDrawerOpen(open);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const drawerContent = (
    <Box
      sx={{
        width: 280,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper'
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          p: 3,
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <img
            src={Logo}
            alt="Logo"
            style={{
              height: 40,
              borderRadius: '50%',
              maxWidth: '100%'
            }}
          />
        </Stack>
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Stack>

      <Divider />

      {isAuthenticated() && user && (
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar alt={user.first_name || "Usuário"} sx={{ width: 48, height: 48 }}>
            {user.first_name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography fontWeight={600}>{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email || user.username}
            </Typography>
          </Box>
        </Box>
      )}

      <Divider />

      <List sx={{ flexGrow: 1, p: 2 }}>
        {(isAuthenticated()
          ? [
              { path: '/painel', icon: <DashboardIcon />, text: 'Painel' },
              { path: '/servicos', icon: <BuildIcon />, text: 'Serviços' },
              { path: '/perfil', icon: <PersonIcon />, text: 'Meu Perfil' }
            ]
          : [
              { path: '/', icon: <HomeIcon />, text: 'Home' },
              { path: '/servicos', icon: <BuildIcon />, text: 'Serviços' },
              { path: '/contato', icon: <ContactMailIcon />, text: 'Contato' }
            ]
        ).map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton 
              component={Link} 
              to={item.path}
              className={isActive(item.path)}
              sx={{ borderRadius: 1 }}
            >
              <IconButton size="small" sx={{ mr: 1, color: 'inherit' }}>
                {item.icon}
              </IconButton>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <Box sx={{ p: 3 }}>
        {isAuthenticated() ? (
          <PrimaryButton
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLoginClick}
            startIcon={<LogoutIcon />}
          >
            Sair
          </PrimaryButton>
        ) : (
          <>
            <PrimaryButton
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => navigate('/login')}
              startIcon={<LoginIcon />}
              sx={{ mb: 2 }}
            >
              Entrar
            </PrimaryButton>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/cadastro')}
              startIcon={<HowToRegIcon />}
            >
              Criar conta
            </Button>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      sx={{
        // background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'background.paper',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        transition: 'all 0.3s ease-in-out',
        top: isVisible ? 0 : '-100px',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
        borderBottom: scrolled ? 'none' : '1px solid rgba(0,0,0,0.05)',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1600,
          margin: '0 auto',
          px: { xs: 3, sm: 4, md: 6 }
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            py: 2,
            minHeight: '80px !important',
            width: '100%'
          }}
          disableGutters
        >
          {/* Logo e Menu Hamburguer (Mobile) */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={toggleDrawer(true)}
              color="inherit"
              edge="start"
              sx={{
                p: 1,
                mr: 2,
                display: { xs: 'flex', md: 'none' }
              }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Logo e Nome (Desktop) */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'primary.main',
                textDecoration: 'none',
                gap: 2,
                ml: { xs: 0, md: 3 }
              }}
            >
              <img
                src={Logo}
                alt="Logo"
                style={{
                  height: 42,
                  width: 'auto',
                  maxWidth: '100%'
                }}
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  display: { xs: 'none', md: 'block' },
                  fontWeight: 700,
                  letterSpacing: '-0.5px'
                }}
              >
                FireCloud
              </Typography>
            </Box>
          </Box>

          {/* Mobile - Ícones à direita */}
          <Box sx={{ 
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            gap: 1
          }}>
            {!isAuthenticated() && (
              <IconButton
                color="primary"
                onClick={() => navigate('/login')}
                sx={{ p: 1 }}
              >
                <LoginIcon />
              </IconButton>
            )}
            
            {isAuthenticated() && (
              <>
                <IconButton color="inherit">
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </>
            )}
          </Box>

          {/* Desktop Navigation */}
          <Stack
            direction="row"
            spacing={3}
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              flexWrap: 'nowrap',
              mr: { md: 3 }
            }}
          >
            {isAuthenticated() ? (
              <>
                <StyledLink to="/painel" className={isActive('/painel')}>
                  <DashboardIcon sx={{ mr: 0.5 }} /> Dashboard
                </StyledLink>
                <StyledLink to="/servicos" className={isActive('/servicos')}>
                  <BuildIcon sx={{ mr: 0.5 }} /> Serviços
                </StyledLink>
                
                <IconButton color="inherit">
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                
                <IconButton component={Link} to="/profile">
                  <Avatar 
                    alt={user?.first_name || "Usuário"}
                    sx={{ width: 36, height: 36 }}
                  >
                    {user?.name?.charAt(0)}
                  </Avatar>
                </IconButton>
              </>
            ) : (
              <>
                <StyledLink to="/" className={isActive('/')}>
                  <HomeIcon sx={{ mr: 0.5 }} /> Home
                </StyledLink>
                <StyledLink to="/servicos" className={isActive('/servicos')}>
                  <BuildIcon sx={{ mr: 0.5 }} /> Serviços
                </StyledLink>
                <StyledLink to="/contato" className={isActive('/contato')}>
                  <ContactMailIcon sx={{ mr: 0.5 }} /> Contato
                </StyledLink>
                
                <Button
                  variant="outlined"
                  onClick={() => navigate('/cadastro')}
                  startIcon={<HowToRegIcon />}
                  sx={{
                    ml: 2,
                    textTransform: 'none',
                    borderRadius: '8px'
                  }}
                >
                  Criar conta
                </Button>
                
                <PrimaryButton
                  variant="contained"
                  onClick={() => navigate('/login')}
                  startIcon={<LoginIcon />}
                >
                  Entrar
                </PrimaryButton>
              </>
            )}
          </Stack>

          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': {
                width: 280
              }
            }}
          >
            {drawerContent}
          </Drawer>
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default Navbar;