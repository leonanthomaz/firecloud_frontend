import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Menu, 
  MenuItem,
  Box,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Settings,
  Person 
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  handleDrawerToggle: () => void;
  drawerWidth: number;
}

const DashboardNavbar: React.FC<NavbarProps> = ({ handleDrawerToggle, drawerWidth }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { state, logout, isAuthenticated } = useAuth();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const user = state.data?.user;
  const company = state.data?.company

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        height: 70,
        ml: { sm: `${drawerWidth}px` },
        boxShadow: 'none',
        background: 'rgba(255, 255, 255, 0.95)',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Toolbar sx={{ 
        justifyContent: 'space-between', 
        py: 1,
        px: { xs: 2, sm: 3 }
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          flex: 1,
          minWidth: 0,
          gap: 2
        }}>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ 
              mr: 1,
              display: { sm: 'none' } 
            }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>

          <Typography 
            variant="h6" 
            noWrap
            sx={{ 
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: { 
                xs: '1rem',
                sm: '1.25rem'
              }
            }}
          >
            {company?.name || 'Dashboard'}
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, sm: 2 }
        }}>
          {!isSmallScreen && (
            <Box sx={{ 
              textAlign: 'right',
              minWidth: 0,
              overflow: 'hidden'
            }}>
              <Typography 
                variant="subtitle2" 
                noWrap
                sx={{ lineHeight: 1 }}
              >
                {user?.username || 'Usuário'}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                noWrap
              >
                {user?.email || 'Perfil'}
              </Typography>
            </Box>
          )}

          <IconButton
            onClick={handleMenuOpen}
            sx={{ 
              p: 0.5,
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <Avatar sx={{ 
              width: 36, 
              height: 36,
              fontSize: '1rem',
              bgcolor: 'primary.main'
            }}>
              {user?.username?.charAt(0).toUpperCase() || <AccountCircle />}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                width: 200,
                mt: 1,
                boxShadow: 2
              }
            }}
          >
            <MenuItem onClick={() => {
                navigate('/painel/perfil');
                handleMenuClose();
              }}>
                <Person sx={{ mr: 1.5, fontSize: 20 }} />
                Meu Perfil
              </MenuItem>

              <MenuItem onClick={() => {
                navigate('/painel/configuracoes');
                handleMenuClose();
              }}>
                <Settings sx={{ mr: 1.5, fontSize: 20 }} />
                Configurações
              </MenuItem>
            <Divider />
            
            {isAuthenticated() ? (
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <Logout sx={{ mr: 1.5, fontSize: 20 }} />
                Sair
              </MenuItem>
            ) : (
              <MenuItem>
                <AccountCircle sx={{ mr: 1.5, fontSize: 20 }} />
                Login
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardNavbar;