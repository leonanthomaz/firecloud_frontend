import React from 'react';
import { 
  Box, 
  Stack, 
  Typography, 
  Button,
  useMediaQuery, 
  useTheme 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginImage from '@/assets/img/robot-sad.png';

const NotFoundPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #d78484ff 0%, #d5acacff 100%)',
        p: 3,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Efeito de bolhas decorativas */}
      <Box sx={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        zIndex: 0
      }} />
      
      <Box sx={{
        position: 'absolute',
        bottom: '-100px',
        left: '-100px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        zIndex: 0
      }} />

      <Stack
        direction={isMobile ? 'column' : 'row'}
        alignItems="center"
        justifyContent="center"
        spacing={isMobile ? 4 : 8}
        sx={{
          maxWidth: 1200,
          width: '100%',
          zIndex: 1,
          textAlign: 'center'
        }}
      >
        <Box
          component="img"
          src={LoginImage}
          alt="Página não encontrada"
          sx={{ 
            width: '100%',
            maxWidth: 400,
            height: 'auto',
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))',
          }}
        />

        <Stack spacing={3} sx={{ maxWidth: 500 }}>
          <Typography 
            variant="h3"
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main',
              background: 'linear-gradient(45deg, #5b5b5bff, #414141ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Oops! 404
          </Typography>
          
          <Typography 
            variant="h5"
            sx={{ 
              color: 'text.primary',
              fontWeight: 500
            }}
          >
            Página não encontrada
          </Typography>
          
          <Typography 
            variant="body1"
            sx={{ 
              color: 'text.secondary',
              mb: 3
            }}
          >
            A página que você está procurando não existe ou foi movida.
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              fontSize: '1rem',
              borderRadius: '12px',
              textTransform: 'none',
              background: 'linear-gradient(45deg, #1976d2, #00bcd4)',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                background: 'linear-gradient(45deg, #1565c0, #0097a7)'
              }
            }}
          >
            Voltar para a página inicial
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default NotFoundPage;