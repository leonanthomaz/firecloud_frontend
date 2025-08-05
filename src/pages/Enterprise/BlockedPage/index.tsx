import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Box, 
  Button,
  styled,
  keyframes
} from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';
import Layout from '../../../components/Layout';

// Animação com MUI keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Componente de cartão de bloqueio com MUI styled
const BlockedCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

// Componente de container de bloqueio com MUI styled
const BlockedContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(3),
  justifyContent: 'center',
  animation: `${fadeIn} 1s ease-in-out`,
  padding: theme.spacing(2, 0),
}));

const BlockedItem = styled(Box)(({}) => ({
  flex: '1 1 300px',
  maxWidth: 400,
  minWidth: 280,
}));

const BlockedPage = () => {
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h4" component="h1" gutterBottom color="error">
            Acesso Bloqueado
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Seu acesso ao sistema está temporariamente indisponível
          </Typography>
        </Box>

        <BlockedContainer>
          <BlockedItem>
            <BlockedCard elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <ChatIcon color="error" sx={{ fontSize: 40 }} />
                </Box>
                
                <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 600 }}>
                  Bloqueio por Pendência Financeira
                </Typography>
                
                <Typography variant="body2" align="center" color="text.secondary" paragraph>
                  Seu acesso ao sistema foi temporariamente bloqueado devido a pendências financeiras.
                </Typography>
                
                <Typography variant="body2" align="center" color="text.secondary" paragraph>
                  Para regularizar sua situação e restabelecer o acesso, por favor, verifique suas pendências na seção "Financeiro" do sistema.
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    href="/finance"
                    size="large"
                  >
                    Verificar Pendências
                  </Button>
                </Box>
                
                <Typography variant="body2" align="center" color="text.secondary" paragraph>
                  Caso já tenha efetuado o pagamento ou acredite que este bloqueio seja um equívoco, entre em contato com nosso suporte técnico.
                </Typography>
                
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle2" align="center" gutterBottom>
                    <strong>Suporte Técnico:</strong>
                  </Typography>
                  <Typography variant="body2" align="center" color="text.secondary">
                    Telefone: (123) 456-7890
                  </Typography>
                  <Typography variant="body2" align="center" color="text.secondary">
                    E-mail: suporte@empresa.com
                  </Typography>
                </Box>
              </CardContent>
            </BlockedCard>
          </BlockedItem>
        </BlockedContainer>
      </Container>
    </Layout>
  );
};

export default BlockedPage;