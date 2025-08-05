import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Button, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Grid,
  styled
} from '@mui/material';
import { 
  CheckCircleOutline as CheckCircleOutlineIcon,
  WhatsApp as WhatsAppIcon,
  Diamond as DiamondIcon,
  Star as StarIcon,
  FlashOn as FlashOnIcon
} from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const PricingPage = () => {
  const plans = [
    {
      title: 'Plano Pré-Pago',
      price: 'Grátis',
      features: [
        'Sem mensalidade',
        '1 usuário',
        '500MB de armazenamento',
        '10.000 chamadas de API/mês',
        '1 milhão de tokens/mês',
        'Chatbot incluso',
        'Sem suporte incluso',
      ],
      icon: <FlashOnIcon color="action" sx={{ fontSize: 40 }} />,
      featured: false
    },
    {
      title: 'Plano Spark',
      price: 'R$ 49/mês',
      features: [
        '2 usuários',
        '1GB de armazenamento',
        '10.000 chamadas de API/mês',
        '1 milhão de tokens/mês',
        'Chatbot incluso',
        'Relatórios básicos',
        'Teste grátis de 7 dias',
      ],
      icon: <StarIcon color="primary" sx={{ fontSize: 40 }} />,
      featured: false
    },
    {
      title: 'Plano Blaze',
      price: 'R$ 199/mês',
      features: [
        'Até 10 usuários',
        '5GB de armazenamento',
        '100.000 chamadas de API/mês',
        '5 milhões de tokens/mês',
        'Chatbot incluso',
        'Suporte via WhatsApp',
        'Relatórios avançados',
        'Automação de processos',
        'Teste grátis de 7 dias',
      ],
      icon: <DiamondIcon sx={{ fontSize: 40, color: 'gold' }} />,
      featured: true
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8, px: { xs: 3, sm: 4 } }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h4" component="h2" gutterBottom>
          Nossos Planos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Escolha o plano que melhor se adapta às suas necessidades.
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan, index) => (
          <Grid 
            item 
            key={index}
            xs={12}
            sm={6}
            md={5}
            lg={4}
            display="flex"
            justifyContent="center"
          >
            <Box 
              sx={{ 
                width: '100%',
                maxWidth: 400,
                minWidth: 275
              }}
            >
              <StyledCard sx={{ 
                border: plan.featured ? `2px solid gold` : undefined,
                height: '100%'
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    gap: 2
                  }}>
                    <Box sx={{ textAlign: 'center' }}>
                      {plan.icon}
                    </Box>
                    
                    <Typography variant="h5" component="h3" textAlign="center">
                      {plan.title}
                    </Typography>
                    
                    <Typography variant="h4" component="div" textAlign="center" color="primary">
                      {plan.price}
                    </Typography>

                    <List dense sx={{ width: '100%' }}>
                      {plan.features.map((feature, featureIndex) => (
                        <ListItem key={featureIndex} disablePadding>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircleOutlineIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature} 
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>

                    <Box sx={{ mt: 'auto', width: '100%', pt: 2 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        color={plan.featured ? 'secondary' : 'primary'}
                        startIcon={<WhatsAppIcon />}
                        href="https://wa.me/SEU_NUMERO_WHATSAPP"
                        target="_blank"
                        rel="noopener noreferrer"
                        size="large"
                      >
                        Fale Conosco
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </StyledCard>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PricingPage;
