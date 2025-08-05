import { 
  Box, 
  Typography, 
  Chip, 
  Container, 
  Stack,
  useTheme
} from '@mui/material';

const TechnologiesComponent = () => {
  const theme = useTheme();
  const tecnologias = ['Machine Learning', 'Deep Learning', 'NLP', 'Visão Computacional'];

  return (
    <Box
      component="section"
      sx={{
        background: `linear-gradient(135deg, #d2e8ff 30%, #a8f0fa 70%)`,
        padding: theme.spacing(7.5, 0),
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeIn 1s ease-in-out',
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 }
        }
      }}
    >
      {/* Overlay superior */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: theme.spacing(10),
          background: `linear-gradient(to bottom, ${theme.palette.primary.light}00, ${theme.palette.background.default})`,
          transform: 'translateY(-100%)'
        }}
      />
      
      <Container maxWidth="lg">
        <Box textAlign="center" mb={4}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom
            sx={{ 
              // color: theme.palette.getContrastText(theme.palette.primary.main),
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Tecnologias que Utilizamos
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              // color: theme.palette.getContrastText(theme.palette.primary.main),
              opacity: 0.9,
              maxWidth: 600,
              margin: '0 auto'
            }}
          >
            Domine as tecnologias mais avançadas do mercado
          </Typography>
        </Box>
        
        <Stack 
          direction="row" 
          flexWrap="wrap" 
          justifyContent="center" 
          gap={2}
          sx={{
            '& .MuiChip-root': {
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              fontSize: '1rem',
              padding: theme.spacing(1),
              boxShadow: theme.shadows[2],
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4],
                backgroundColor: theme.palette.background.default,
              },
              transition: theme.transitions.create(['transform', 'box-shadow', 'background-color'], {
                duration: theme.transitions.duration.short,
              }),
            }
          }}
        >
          {tecnologias.map((tecnologia, index) => (
            <Chip 
              key={index} 
              label={tecnologia}
              size="medium"
              sx={{
                minWidth: 150,
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
            />
          ))}
        </Stack>
      </Container>
      
      {/* Overlay inferior */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          height: theme.spacing(10),
          background: `linear-gradient(to bottom, ${theme.palette.primary.light}00, ${theme.palette.background.default})`,
          transform: 'translateY(100%) rotate(180deg)'
        }}
      />
    </Box>
  );
};

export default TechnologiesComponent;