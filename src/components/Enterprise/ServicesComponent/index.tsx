import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Stack,
  useTheme,
  // useMediaQuery
} from '@mui/material';
import {
  AssessmentOutlined as AssessmentOutlinedIcon,
  ChatBubbleOutlineOutlined as ChatBubbleOutlineOutlinedIcon,
  SettingsSuggestOutlined as SettingsSuggestOutlinedIcon
} from '@mui/icons-material';

const ServicesComponent = () => {
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const services = [
    {
      icon: <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Chatbots',
      description: 'Automatize o atendimento, capture leads e aumente a satisfação do cliente 24h por dia.',
    },
    {
      icon: <AssessmentOutlinedIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Sites com Gestão',
      description: 'Tenha um site bonito, rápido e com painel de controle completo para gerenciar seu negócio.',
    },
    {
      icon: <SettingsSuggestOutlinedIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Automações',
      description: 'Elimine tarefas repetitivas com fluxos inteligentes e integração com sistemas que você já usa.',
    },
  ];


  return (
    <Container maxWidth="lg" sx={{ py: 8, px: { xs: 3, sm: 4 } }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h4" component="h2" gutterBottom>
          Potencialize seu negócio com IA
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Soluções práticas e acessíveis para empresas que querem vender mais, automatizar processos e se destacar no digital.
        </Typography>
      </Box>


      <Stack 
        direction={{ xs: 'column', sm: 'row' }}
        spacing={4}
        alignItems="center"
        justifyContent="center"
        sx={{ width: '100%' }}
      >
        {services.map((service, index) => (
          <Box 
            key={index}
            sx={{ 
              width: { xs: '100%', sm: '50%', md: '33%' },
              maxWidth: 350,
              minWidth: 250,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 3.75,
                textAlign: 'center',
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: theme.transitions.create(['transform', 'box-shadow'], {
                  duration: theme.transitions.duration.standard,
                }),
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.shadows[6],
                },
                animation: 'fadeInUp 0.5s ease-in-out',
                '@keyframes fadeInUp': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(20px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <Box sx={{ mb: 3 }}>{service.icon}</Box>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                {service.title}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ flexGrow: 1 }}
              >
                {service.description}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Stack>
    </Container>
  );
};

export default ServicesComponent;