import {
  Container,
  Typography,
  Box,
  Paper,
  styled,
  keyframes,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  LightbulbOutlined as LightbulbOutlinedIcon,
  SettingsSuggestOutlined as SettingsSuggestOutlinedIcon,
  RocketLaunchOutlined as RocketLaunchOutlinedIcon,
  EmojiObjectsOutlined as EmojiObjectsOutlinedIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from '@mui/icons-material';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StepPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3.75),
  textAlign: 'center',
  animation: `${fadeInUp} 0.5s ease-in-out`,
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}));

const HowItWorksPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  const steps = [
    {
      icon: <LightbulbOutlinedIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Entendimento do Negócio',
      description: 'Analisamos sua empresa e identificamos as melhores oportunidades de automação e presença digital.',
    },
    {
      icon: <SettingsSuggestOutlinedIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Criação da Solução',
      description: 'Desenvolvemos um chatbot, site ou automação sob medida para sua operação.',
    },
    {
      icon: <EmojiObjectsOutlinedIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Testes e Ajustes',
      description: 'Avaliamos o funcionamento real com testes e ajustes para entregar algo confiável desde o início.',
    },
    {
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Entrega com Suporte',
      description: 'Publicamos a solução e te orientamos no uso, com suporte dedicado nos primeiros passos.',
    },
    {
      icon: <RocketLaunchOutlinedIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Resultados e Crescimento',
      description: 'Acompanhamos o impacto e propomos melhorias contínuas pra você crescer ainda mais.',
    },
  ];

  const getColumns = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h4" component="h2" gutterBottom>
          Como Transformamos sua Ideia em Resultado
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Nosso processo une tecnologia com estratégia pra entregar soluções que realmente fazem diferença no seu negócio.
        </Typography>
      </Box>

      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
        gap={4}
        sx={{
          '& > *': {
            width: `calc(${100 / getColumns()}% - ${theme.spacing(4)})`,
            minWidth: 250
          }
        }}
      >
        {steps.map((step, index) => (
          <StepPaper key={index} elevation={3}>
            <Box sx={{ mb: 2 }}>{step.icon}</Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {step.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {step.description}
            </Typography>
          </StepPaper>
        ))}
      </Stack>
    </Container>
  );
};

export default HowItWorksPage;
