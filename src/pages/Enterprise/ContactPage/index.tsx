import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
  Stack,
  styled,
  keyframes
} from '@mui/material';
import Layout from '../../../components/Layout';
import Navbar from '../../../components/Enterprise/Navbar';

// Animação com MUI keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Estilos dos componentes usando MUI styled
const ContactForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(3),
  animation: `${fadeIn} 1s ease-in-out`,
}));

const ContactPage = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [servico, setServico] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(true);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Lógica de envio do formulário
    setNome('');
    setEmail('');
    setServico('');
    setMensagem('');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout withWhatsApp>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            Entre em Contato
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Preencha o formulário abaixo e entraremos em contato
          </Typography>
        </Box>

        {loading ? (
          <Stack spacing={3}>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="40%" height={30} />
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <Skeleton variant="rectangular" height={56} sx={{ flex: 1 }} />
              <Skeleton variant="rectangular" height={56} sx={{ flex: 1 }} />
            </Stack>
            
            <Skeleton variant="rectangular" height={56} />
            <Skeleton variant="rectangular" height={120} />
            <Skeleton variant="rectangular" height={56} />
          </Stack>
        ) : (
          <ContactForm onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <TextField
                  label="Nome"
                  variant="outlined"
                  fullWidth
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Stack>

              <FormControl fullWidth variant="outlined">
                <InputLabel id="servico-label">Serviço de Interesse</InputLabel>
                <Select
                  labelId="servico-label"
                  value={servico}
                  onChange={(e) => setServico(e.target.value)}
                  label="Serviço de Interesse"
                  required
                >
                  <MenuItem value="">
                    <em>Selecione um serviço</em>
                  </MenuItem>
                  <MenuItem value="assistente-virtual">Assistente Virtual</MenuItem>
                  <MenuItem value="chatbot-whatsapp">Chatbot para WhatsApp Business</MenuItem>
                  <MenuItem value="site-corporativo">Implementação de Site Corporativo</MenuItem>
                  <MenuItem value="analise-dados">Análise de Dados</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Mensagem"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                required
              />

              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                size="large"
                sx={{ py: 1.5 }}
              >
                Enviar Mensagem
              </Button>
            </Stack>
          </ContactForm>
        )}
      </Container>
    </Layout>
  );
};

export default ContactPage;