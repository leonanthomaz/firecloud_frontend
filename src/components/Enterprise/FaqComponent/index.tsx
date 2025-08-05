import { useState } from 'react';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  styled
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  '&:before': {
    display: 'none'
  },
  '&.Mui-expanded': {
    margin: theme.spacing(1, 0)
  }
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&.Mui-expanded': {
    backgroundColor: theme.palette.action.selected,
    minHeight: '48px',
    '& .MuiAccordionSummary-content': {
      margin: theme.spacing(1.5, 0)
    }
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: theme.palette.primary.main
  }
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
  borderTop: `1px solid ${theme.palette.divider}`
}));

const FaqPage = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqs = [
    {
      question: 'O que exatamente a FireCloud faz?',
      answer: 'A FireCloud desenvolve soluções digitais sob medida, com foco em automações, chatbots e presença digital inteligente pra pequenas e médias empresas que querem ganhar tempo, escalar atendimento ou vender mais.'
    },
    {
      question: 'Quais tipos de bots vocês criam?',
      answer: 'Chatbots de atendimento (WhatsApp, Instagram, site), bots de vendas com integração de pagamento (como Mercado Pago), e automações que substituem processos manuais — como envio de mensagens, emissão de pedidos ou integração com sistemas.'
    },
    {
      question: 'Sou dono de uma pizzaria. Isso serve pra mim?',
      answer: 'Serve demais. Inclusive já entregamos um sistema completo com pedidos em tempo real, mapa de entregas, pagamento por Pix, comando automático na cozinha e mais. Nosso foco é justamente facilitar a vida de negócios locais.'
    },
    {
      question: 'Vocês usam inteligência artificial mesmo ou é só marketing?',
      answer: 'Usamos sim, mas com pé no chão. Integramos IA em pontos estratégicos — como atendimento com linguagem natural, sugestões automáticas e classificação de informações. Não é só enfeite: é pra funcionar e te dar resultado.'
    },
    {
      question: 'Quanto custa desenvolver um bot ou automação com vocês?',
      answer: 'Depende do que você precisa. A gente monta proposta com base na complexidade e no impacto da solução. O orçamento é transparente, sem pegadinha. É só entrar em contato que a gente avalia junto.'
    },
    {
      question: 'Preciso ter conhecimento técnico pra usar?',
      answer: 'Zero. A gente entrega tudo pronto pra você usar. E ainda oferece suporte e explicação simples de como acompanhar e gerenciar.'
    },
    {
      question: 'Depois da entrega, vocês somem ou continuam por perto?',
      answer: 'Continuamos junto. Oferecemos suporte técnico, monitoramento e ajustes conforme o negócio evolui. O sucesso da solução também é nosso interesse.'
    },
  ];


  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h4" component="h2" gutterBottom>
          Perguntas Frequentes
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Encontre respostas para as dúvidas mais comuns sobre nossos serviços
        </Typography>
      </Box>
      <Box>
        {faqs.map((faq, index) => (
          <StyledAccordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            TransitionProps={{ unmountOnExit: true }}
          >
            <StyledAccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography variant="subtitle1" fontWeight={500}>
                {faq.question}
              </Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Typography variant="body1" color="text.secondary">
                {faq.answer}
              </Typography>
            </StyledAccordionDetails>
          </StyledAccordion>
        ))}
      </Box>
    </Container>
  );
};

export default FaqPage;