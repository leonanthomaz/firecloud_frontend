import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  styled,
  useTheme
} from '@mui/material';

interface FormContainerProps {
  component?: React.ElementType;
}

const FormContainer = styled(Box)<FormContainerProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  maxWidth: 800,
  margin: '0 auto',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
}));

const QuickContactForm = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const theme = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Validação básica de email
    if (e.target.value) {
      setEmailError(!/\S+@\S+\.\S+/.test(e.target.value));
    } else {
      setEmailError(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailError && email) {
      alert('Formulário rápido enviado!');
      setEmail('');
    }
  };

  return (
    <Box>
      <Box textAlign="center" mb={6}>
        <Typography variant="h4" component="h2" gutterBottom>
          Contato Rápido
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Responderemos o mais rápido possível
        </Typography>
      </Box>
      <FormContainer 
        component="form" 
        onSubmit={handleSubmit}
        sx={{
          [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2),
            gap: theme.spacing(2)
          }
        }}
      >        
        <TextField
          label="Seu E-mail"
          name="email"
          type="email"
          value={email}
          onChange={handleChange}
          error={emailError}
          helperText={emailError ? 'Por favor, insira um e-mail válido' : ''}
          required
          fullWidth
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'primary.main',
              },
              '&:hover fieldset': {
                borderColor: 'primary.dark',
              },
            }
          }}
        />
        
        <Button 
          variant="contained" 
          color="primary" 
          type="submit"
          size="large"
          disabled={emailError || !email}
          sx={{
            mt: 1,
            py: 1.5,
            fontWeight: 600,
            fontSize: '1rem'
          }}
        >
          Enviar
        </Button>
      </FormContainer>
    </Box>
  );
};

export default QuickContactForm;