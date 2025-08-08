import { ReactNode } from 'react';
import { FloatingWhatsApp } from 'react-floating-whatsapp';
import { styled, Box, Container } from '@mui/material';
import Logo from '@/assets/img/firecloud-logo-branco.png';

interface LayoutProps {
  children: ReactNode;
  withSidebar?: boolean;
  withWhatsApp?: boolean;
}

const LayoutContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'withSidebar',
})<{ withSidebar?: boolean }>(({ theme, withSidebar }) => ({
  display: 'flex',
  flexDirection: withSidebar ? 'row' : 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const MainContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'withSidebar',
})<{ withSidebar?: boolean }>(({ theme, withSidebar }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  marginLeft: withSidebar ? '20px' : 0,
  marginTop: theme.spacing(2),
  width: withSidebar ? `calc(100% - 20px)` : '100%',
  transition: theme.transitions.create(['margin', 'padding'], {
    duration: theme.transitions.duration.standard,
  }),
  justifyContent: 'center' ,
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
    width: '100%',
    padding: theme.spacing(2),
  },
}));

const Layout: React.FC<LayoutProps> = ({ children, withSidebar, withWhatsApp }) => {
  return (
    <LayoutContainer withSidebar={withSidebar}>
      <Container
        sx={{
          width: '100%',
          maxWidth: '1200px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <MainContent withSidebar={withSidebar}>
          {children}
        </MainContent>
      </Container>
      
      {withWhatsApp && (
        <FloatingWhatsApp
          phoneNumber="+5521998359326"
          accountName="FireCloud"
          chatMessage="Olá! Como posso te ajudar?"
          allowClickAway
          allowEsc
          darkMode={false}
          placeholder="Digite sua mensagem..."
          avatar={Logo}
          statusMessage="Online"
          notification={false}
        />
      )}
      
    </LayoutContainer>
  );
};

export default Layout;