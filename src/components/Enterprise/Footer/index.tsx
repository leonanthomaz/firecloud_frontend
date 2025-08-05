// src/components/Footer.tsx
import { Box, Typography, Link, Container, Stack } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        background: 'linear-gradient(135deg, #c9edf7 30%, #6beeff 50%)',
        padding: '40px 0',
        mt: 4 // Adiciona margem no topo para separar do elemento anterior
      }}
    >
      <Container maxWidth="lg">
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={{ xs: 4, md: 6 }}
          justifyContent="space-between"
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Contato
            </Typography>
            <Typography variant="body2">
              Endereço: Rua Antonio Nunes, 1 - Alto da Boa Vista - Rio de Janeiro, RJ
              <br />
              Telefone: (21) 99809-0928
              <br />
              E-mail: contato@firecloud.com
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Links Úteis
            </Typography>
            <Stack spacing={1}>
              <Link href="/" color="inherit">
                Página Inicial
              </Link>
              <Link href="/servicos" color="inherit">
                Serviços
              </Link>
              <Link href="/contato" color="inherit">
                Contato
              </Link>
            </Stack>
          </Box>

          <Box sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'flex-start', md: 'flex-end' }
          }}>
            <Typography variant="h6" gutterBottom>
              Redes Sociais
            </Typography>
            <Stack direction="row" spacing={2}>
              <Link href="#" color="inherit">
                <FacebookIcon />
              </Link>
              <Link href="#" color="inherit">
                <TwitterIcon />
              </Link>
              <Link href="#" color="inherit">
                <InstagramIcon />
              </Link>
            </Stack>
          </Box>
        </Stack>

        <Typography variant="body2" align="center" sx={{ mt: 4 }}>
          © {new Date().getFullYear()} FireCloud. Todos os direitos reservados.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;