import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { keyframes, styled } from '@mui/system';
import logo from '@/assets/img/firecloud-logo-figure-sf.png';

// Animação do fogo
const fireAnimation = keyframes`
  0%, 100% {
    transform: scale(1) translateY(0);
    opacity: 0.9;
  }
  25% {
    transform: scale(1.05) translateY(-2px);
    opacity: 1;
  }
  50% {
    transform: scale(0.98) translateY(1px);
    opacity: 0.95;
  }
  75% {
    transform: scale(1.03) translateY(-1px);
    opacity: 1;
  }
`;

// Componente de fogo estilizado
const FireLogo = styled('div')({
  position: 'relative',
  width: '220px', // Aumentado de 120px para 220px
  height: '220px', // Aumentado de 120px para 220px
  marginBottom: '24px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    animation: `${fireAnimation} 2s ease-in-out infinite`,
    filter: 'drop-shadow(0 0 12px rgba(255, 100, 0, 0.5))' // Sombra mais intensa
  }
});

const LoadingPage: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'background.paper',
        zIndex: 1300,
        backdropFilter: 'blur(4px)',
        transition: 'opacity 0.3s ease-out'
      }}
    >
      {/* Container principal */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Logo com animação de fogo */}
        <FireLogo>
          <img src={logo} alt="FireCloud Logo" />
        </FireLogo>

        {/* Circular Progress abaixo da logo */}
        <CircularProgress 
          size={60}
          thickness={4}
          disableShrink
          sx={{
            color: 'primary.main',
            mb: 3,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round'
            }
          }}
        />

        {/* Texto com efeito de pulso */}
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 500,
            animation: `${fireAnimation} 2s ease-in-out infinite`,
            textTransform: 'uppercase',
            letterSpacing: '4px',
            fontSize: '1rem'
          }}
        >
          Carregando...
        </Typography>
      </Box>

      {/* Efeito de partículas (opcional) */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: -1
        }}
      >
        {[...Array(8)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              backgroundColor: 'primary.main',
              borderRadius: '50%',
              opacity: 0.2,
              animation: `${fireAnimation} ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: 6,
              height: 6,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default LoadingPage;