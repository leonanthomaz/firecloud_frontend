import React, { useState, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, Button, TextField, Paper, useMediaQuery, useTheme, Grid, CircularProgress } from '@mui/material';
import { useMuiTheme } from '../../../styles/muiTheme';
import ForgotPasswordImage from '@/assets/img/robot-smart-rf.png';
// import { useAuth } from '../../../contexts/AuthContext';
import { validateEmailApi } from '../../../services/api/auth';
import { useSnackbar } from 'notistack';

const ForgotPasswordPage: React.FC = () => {
    // const { forgotPassword } = useAuth();
    const navigate = useNavigate();
    const theme = useMuiTheme();
    const muiTheme = useTheme();
    const isSmallScreen = useMediaQuery(muiTheme.breakpoints.down('sm'));
    const [usernameOrEmail, setUsernameOrEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleUsernameOrEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsernameOrEmail(event.target.value);
    };

    const handleForgotPassword = async () => {
        setIsLoading(true);
        try {
            await validateEmailApi(usernameOrEmail);
            enqueueSnackbar('Um link de recuperação de senha foi enviado para o seu email.', { variant: 'success' });
            navigate('/login');
        } catch (error) {
            enqueueSnackbar('Token de redefinição de senha inválido.', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: isSmallScreen ? 'linear-gradient(135deg, #d2e8ff 30%, #a8f0fa 70%)' : 'linear-gradient(to right, #d0eff5 40%, #ffffff 60%)',
                padding: theme.spacing(3),
            }}
        >
            <Grid container spacing={0} justifyContent="center" alignItems="stretch" sx={{ width: '100%', maxWidth: '1200px' }}>
                {!isSmallScreen && (
                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', padding: theme.spacing(4) }}>
                        <Box
                            component="img"
                            src={ForgotPasswordImage}
                            alt="Imagem de Recuperação de Senha"
                            sx={{ maxWidth: '100%', maxHeight: '400px' }}
                        />
                    </Grid>
                )}

                <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Paper
                        elevation={3}
                        sx={{
                            padding: theme.spacing(4),
                            width: '100%',
                            maxWidth: '400px',
                            mx: 'auto',
                            borderRadius: theme.spacing(1),
                        }}
                    >
                        <Typography variant="h4" align="center" gutterBottom>
                            Recuperar Senha
                        </Typography>

                        <TextField
                            label="Username ou Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={usernameOrEmail}
                            onChange={handleUsernameOrEmailChange}
                        />

                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ marginTop: theme.spacing(3), fontWeight: 'bold', fontSize: '1.1rem' }}
                            onClick={handleForgotPassword}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Enviar Link de Recuperação'}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body2">
                                <Link to="/login" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
                                    Voltar para Login
                                </Link>
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ForgotPasswordPage;