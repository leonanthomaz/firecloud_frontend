import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Box, 
  Stack,
  Button,
  useMediaQuery,
  useTheme,
  Paper,
  Divider,
  styled
} from '@mui/material';
import {
  Chat as ChatIcon,
  WhatsApp as WhatsAppIcon,
  Web as WebIcon,
  Analytics as AnalyticsIcon,
  IntegrationInstructions as IntegrationIcon,
  Code as CodeIcon,
  Cloud as CloudIcon,
} from '@mui/icons-material';
import Layout from '../../../components/Layout';
import Navbar from '../../../components/Enterprise/Navbar';


const FloatingCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
  borderRadius: '12px',
}));

const ServicePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const services = [
    {
      title: 'Assistente Virtual Inteligente',
      description: 'Soluções de IA conversacional para atendimento 24/7 com integração multi-canal.',
      icon: <ChatIcon color="secondary" sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Chatbot WhatsApp Business API',
      description: 'Implementação oficial com mensagens template e atendimento humano integrado.',
      icon: <WhatsAppIcon color="secondary" sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Sites Corporativos com IA',
      description: 'Plataformas web modernas com chatbots integrados e análise de comportamento.',
      icon: <WebIcon color="secondary" sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Análise de Dados Conversacionais',
      description: 'Relatórios inteligentes de interações para melhorar sua estratégia.',
      icon: <AnalyticsIcon color="secondary" sx={{ fontSize: 40 }} />,
    },
  ];

  const customSolutions = [
    {
      title: 'Chatbot Independente',
      description: 'Soluções white-label para implementação em qualquer infraestrutura',
      icon: <IntegrationIcon color="secondary" sx={{ fontSize: 40 }} />,
    },
    {
      title: 'API de Conversação',
      description: 'Integre nosso motor de diálogo em suas aplicações existentes',
      icon: <CodeIcon color="secondary" sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Solução Híbrida',
      description: 'Combine nossa plataforma com suas soluções atuais',
      icon: <CloudIcon color="secondary" sx={{ fontSize: 40 }} />,
    },
  ];

  return (
    <Layout withWhatsApp>
      <Navbar />
      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 10 }}>
        {/* Core Services */}
        <Box textAlign="center" mb={8}>
          <Typography variant="h4" component="h2" fontWeight={700} gutterBottom>
            Nossas Soluções Integradas
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Plataforma completa ou módulos independentes para sua estratégia digital
          </Typography>
        </Box>
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={4} 
          justifyContent="center"
          mb={10}
          useFlexGap
          flexWrap="wrap"
        >
          {services.map((service, index) => (
            <Box key={index} sx={{ width: { xs: '100%', sm: '45%', md: '35%' } }}>
              <FloatingCard elevation={3}>
                <CardContent>
                  <Stack spacing={3} alignItems="center" textAlign="center">
                    <Box sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'primary.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {service.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {service.description}
                    </Typography>
                  </Stack>
                </CardContent>
              </FloatingCard>
            </Box>
          ))}
        </Stack>

        {/* Custom Solutions */}
        <Paper elevation={0} sx={{ 
          p: 4, 
          mb: 10,
          borderRadius: '12px',
          bgcolor: 'background.paper'
        }}>
          <Box textAlign="center" mb={6}>
            <Typography variant="h4" component="h2" fontWeight={700} gutterBottom>
              Soluções Personalizadas
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Implemente chatbots independentes sem depender de nossa plataforma
            </Typography>
          </Box>

          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={4}
            divider={<Divider orientation={isMobile ? 'horizontal' : 'vertical'} flexItem />}
          >
            {customSolutions.map((solution, index) => (
              <Stack key={index} spacing={3} sx={{ p: 2, flex: 1 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{
                    bgcolor: 'primary.light',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {solution.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    {solution.title}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {solution.description}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Paper>

        {/* CTA Section */}
        <Box textAlign="center">
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Pronto para revolucionar sua comunicação?
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Nossos especialistas estão prontos para criar a solução perfeita
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            sx={{
              borderRadius: '50px',
              px: 6,
              py: 2,
              fontWeight: 600,
            }}
          >
            Solicitar Demonstração
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

export default ServicePage;