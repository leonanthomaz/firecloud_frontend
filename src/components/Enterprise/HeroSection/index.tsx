import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Stack, 
  keyframes, 
  styled,
  Modal,
  IconButton
} from '@mui/material';
import robotImage from '@/assets/img/undraw_status-update_7gqz.svg';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

interface HeroContainerProps {
  component?: React.ElementType;
}

const HeroContainer = styled(Box)<HeroContainerProps>(({}) => ({
  height: '110vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #d2e8ff 30%, #a8f0fa 70%)' ,
  animation: `${fadeIn} 1s ease-in-out`,
  position: 'relative',
  overflow: 'hidden'
}));

const WaveDivider = styled(Box)({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  height: 210,
  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1440 320\'%3E%3Cpath fill=\'%23ffffff\' fill-opacity=\'1\' d=\'M0,288L48,288C96,288,192,288,288,266.7C384,245,480,203,576,170.7C672,139,768,117,864,122.7C960,128,1056,160,1152,170.7C1248,181,1344,171,1392,165.3L1440,160L1440,320L0,320Z\'%3E%3C/path%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'bottom'
});

const VideoModal = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '900px',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  outline: 'none',
  maxHeight: '90vh',
  overflow: 'auto',
  
  '& iframe': {
    width: '100%',
    height: '500px',
    border: 'none',
    borderRadius: theme.shape.borderRadius
  }
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
  color: theme.palette.grey[500],
}));

const HeroSection = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isPendingRegister, setIsPendingRegister] = useState(false);

  useEffect(() => {
    const pending = localStorage.getItem("pendingRegister");
    setIsPendingRegister(!!pending);
  }, []);

  const handleContactClick = () => {
    const pending = localStorage.getItem("pendingRegister");
    if (pending) {
      navigate("/completar-cadastro");
    } else {
      navigate("/cadastro");
    }
  };

  const handleOpenDemo = () => {
    setOpen(true);
  };

  const handleCloseDemo = () => {
    setOpen(false);
  };

  return (
    <HeroContainer component="section">
      <Container maxWidth="lg" sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          alignItems="center" 
          spacing={{ xs: 2, md: 4 }} 
          sx={{ width: '100%' }}
        >
          <Box sx={{ 
            textAlign: { xs: 'center', md: 'left' }, 
            p: 2, 
            width: { xs: '100%', md: '50%' } 
          }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontSize: { xs: '2.5rem', md: '3rem' },
                fontFamily: "'Bebas Neue', sans-serif",
                fontWeight: 600,
                letterSpacing: 1,
                lineHeight: 1.2
              }}
            >
              Inteligência Artificial para o seu Negócio
            </Typography>
            <Typography 
              variant="body1" 
              paragraph 
              sx={{ 
                fontSize: { xs: '1rem', md: '1.1rem' },
                maxWidth: { xs: '100%', md: '80%' },
                mx: { xs: 'auto', md: 0 }
              }}
            >
              Transforme seus processos com soluções de IA personalizadas.
            </Typography>
            <Box sx={{ 
              position: 'relative', 
              zIndex: 1,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: { xs: 'center', md: 'flex-start' }
            }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}
                onClick={handleContactClick}
              >
                {isPendingRegister ? "Complete seu cadastro!" : "Faça seu cadastro!"}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}
                onClick={handleOpenDemo}
              >
                Veja como funciona
              </Button>
            </Box>
          </Box>
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            justifyContent: 'center', 
            width: { xs: '100%', md: '50%' },
            '& img': {
              maxWidth: '80%',
              height: 'auto',
              animation: `${fadeIn} 1s ease-in-out`
            }
          }}>
            <img src={robotImage} alt="Robô de IA" />
          </Box>
        </Stack>
      </Container>
      <WaveDivider />

      {/* Modal do Vídeo */}
      <Modal
        open={open}
        onClose={handleCloseDemo}
        aria-labelledby="video-modal-title"
        aria-describedby="video-modal-description"
      >
        <VideoModal>
          <CloseButton onClick={handleCloseDemo}>
            <CloseIcon />
          </CloseButton>
          <Typography variant="h5" component="h2" mb={3}>
            Demonstração do Sistema
          </Typography>
          {/* Substitua pela embed do seu vídeo (YouTube, Vimeo, etc) */}
          <iframe 
            src="https://www.youtube.com/embed/SEU_ID_DO_VIDEO" 
            title="Demonstração do Sistema"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          />
          <Typography variant="body1" mt={2}>
            Assista ao vídeo para entender como nosso sistema pode ajudar seu negócio.
          </Typography>
        </VideoModal>
      </Modal>
    </HeroContainer>
  );
};

export default HeroSection;