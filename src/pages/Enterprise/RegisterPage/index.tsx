import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { 
  Typography, 
  TextField, 
  Button, 
  Stack, 
  Box, 
  Divider, 
  InputAdornment,
  CircularProgress,
  Paper,
  Link,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  IconButton
} from '@mui/material';
import { AlternateEmail, Email, Lock, Person, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import RegisterImage from '@/assets/img/robot-idea.png';
import { GoogleLogin } from '@react-oauth/google';
import { createGoogleRegisterApi, createRegisterApi } from '../../../services/api/register';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [userData, setUserData] = useState({
    name: '',
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (userData.password !== userData.confirmPassword) {
      enqueueSnackbar('As senhas não coincidem', { variant: 'error' });
      return;
    }
    
    if (!userData.username || !userData.email || !userData.password) {
      enqueueSnackbar('Preencha todos os campos obrigatórios', { variant: 'error' });
      return;
    }

    // Validação de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      enqueueSnackbar('Por favor, insira um email válido', { variant: 'error' });
      return;
    }

    // Validação de força da senha
    if (userData.password.length < 8) {
      enqueueSnackbar('A senha deve ter pelo menos 8 caracteres', { variant: 'error' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepara os dados para o endpoint
      const registerData = {
        name: userData.name,
        first_name: userData.first_name,
        last_name: userData.last_name,
        username: userData.username,
        email: userData.email,
        password_hash: userData.password
      };


      // Aqui pega o registro criado ou existente (pré-cadastro)
      const response = await createRegisterApi(registerData);

      // Salva no localStorage (ou sessionStorage, você decide)
      localStorage.setItem('pendingRegister', JSON.stringify(response));

      enqueueSnackbar('Cadastro realizado com sucesso! Complete seu perfil.', { variant: 'success' });

      // Joga pra completar cadastro SEMPRE
      navigate('/completar-cadastro');

      setShowForm(false);
      
    } catch (error: any) {
      // Tratamento de erros específicos
      let errorMessage = 'Erro ao realizar cadastro. Tente novamente.';
      
      if (error.response) {
        if (error.response.status === 400 && error.response.data.detail === "Email já cadastrado") {
          errorMessage = 'Este email já está cadastrado.';
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        }
      }
      
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async (response: any) => {
    if (!response.credential) {
      enqueueSnackbar('Token do Google ausente', { variant: 'error' });
      return;
    }
    try {
      // A API retorna o registro (novo ou já existente)
      const registerResponse = await createGoogleRegisterApi(response.credential);

      // Salva o registro no localStorage
      localStorage.setItem('pendingRegister', JSON.stringify(registerResponse));

      enqueueSnackbar('Cadastro realizado com sucesso! Complete seu perfil.', { variant: 'success' });

      navigate('/complete-registration');
    } catch (error) {
      enqueueSnackbar('Erro ao fazer login com Google', { variant: 'error' });
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5f9ff 0%, #e1f5fe 100%)',
          p: 2,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Efeitos decorativos */}
        <Box sx={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          zIndex: 0
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 188, 212, 0.1)',
          zIndex: 0
        }} />

        <Box sx={{
          display: 'flex',
          flexDirection: isSmallScreen ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isSmallScreen ? 4 : 8,
          maxWidth: '1200px',
          width: '100%',
          zIndex: 1,
          position: 'relative'
        }}>
          {!isSmallScreen && (
            <Box sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              maxWidth: '600px'
            }}>
              <Box
                component="img"
                src={RegisterImage}
                alt="Register Illustration"
                sx={{ 
                  width: '100%',
                  maxWidth: '500px',
                  height: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.03)'
                  }
                }}
              />
            </Box>
          )}

          <Box sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            maxWidth: '450px',
            width: '100%'
          }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                width: '100%',
                borderRadius: 4,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 40px rgba(31, 38, 135, 0.2)'
                }
              }}
            >
              <Typography 
                variant="h4" 
                align="center" 
                gutterBottom
                sx={{ 
                  mb: 3,
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #1976d2, #00bcd4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Cadastrar
              </Typography>

              <Stack spacing={3}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setShowForm(true)}
                  fullWidth
                  sx={{ 
                    py: 1.5,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    borderRadius: '12px',
                    textTransform: 'none',
                    letterSpacing: '0.5px',
                    background: 'linear-gradient(45deg, #1976d2, #00bcd4)',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                      background: 'linear-gradient(45deg, #1565c0, #0097a7)'
                    }
                  }}
                >
                  Criar Conta
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                  <Divider sx={{ flexGrow: 1, borderColor: 'rgba(0, 0, 0, 0.12)' }} />
                  <Typography variant="body2" sx={{ mx: 2, color: 'text.secondary' }}>
                    OU
                  </Typography>
                  <Divider sx={{ flexGrow: 1, borderColor: 'rgba(0, 0, 0, 0.12)' }} />
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  '& .MuiButton-root': {
                      borderRadius: '12px !important',
                      padding: '8px 16px !important'
                  }
                }}>
                <GoogleLogin
                  onSuccess={handleGoogleRegister}
                  onError={() => {
                    enqueueSnackbar('Erro ao conectar com o Google', { variant: 'error' });
                  }}
                  useOneTap
                  theme="outline"
                  width={isSmallScreen ? '280' : '320'}
                  shape="pill"
                  text="signup_with"
                />
                </Box>

                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                  Já tem uma conta?{' '}
                  <Link 
                    href="/login" 
                    color="primary"
                    sx={{
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Faça login
                  </Link>
                </Typography>
                <Divider/>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Link
                        href="/"
                        color="primary"
                        underline="hover"
                        sx={{
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        '&:hover': {
                            textDecoration: 'underline',
                        }
                        }}
                    >
                        ← Voltar à página inicial
                    </Link>
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Modal do Formulário */}
      <Dialog
        open={showForm}
        onClose={() => setShowForm(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'visible',
            position: 'relative',
            maxWidth: '500px',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.18)'
          }
        }}
      >
        <IconButton
          aria-label="close"
          onClick={() => setShowForm(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        
          <DialogContent sx={{ p: 4, pt: 6 }}>
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{
                mb: 3,
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1976d2, #00bcd4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Cadastro
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                  }}
                >
                  <TextField
                    size="small"
                    fullWidth
                    label="Primeiro Nome"
                    name="first_name"
                    value={userData.first_name}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                      },
                    }}
                  />

                  <TextField
                    size="small"
                    fullWidth
                    label="Sobrenome"
                    name="last_name"
                    value={userData.last_name}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                      },
                    }}
                  />
                </Box>

                <TextField
                  size="small"
                  label="Nome de Usuário"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AlternateEmail />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    },
                  }}
                />

                <TextField
                  size="small"
                  label="Email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                    },
                  }}
                />

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                  }}
                >
                  <TextField
                    size="small"
                    label="Senha"
                    name="password"
                    type="password"
                    value={userData.password}
                    onChange={handleChange}
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                      },
                    }}
                  />

                  <TextField
                    size="small"
                    label="Confirmar Senha"
                    name="confirmPassword"
                    type="password"
                    value={userData.confirmPassword}
                    onChange={handleChange}
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                      },
                    }}
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  size="medium"
                  disabled={isLoading}
                  fullWidth
                  sx={{
                    mt: 2,
                    py: 1.5,
                    fontWeight: 'bold',
                    borderRadius: '10px',
                    textTransform: 'none',
                    letterSpacing: '0.5px',
                    background: 'linear-gradient(45deg, #1976d2, #00bcd4)',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                      background: 'linear-gradient(45deg, #1565c0, #0097a7)',
                    },
                  }}
                >
                  {isLoading ? <CircularProgress size={22} color="inherit" /> : 'Finalizar Cadastro'}
                </Button>
              </Stack>
            </Box>
          </DialogContent>

      </Dialog>
    </>
  );
};

export default RegisterPage;