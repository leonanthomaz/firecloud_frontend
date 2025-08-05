import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button, TextField, Paper, Grid, CircularProgress } from '@mui/material';
import { useMuiTheme } from '../../../styles/muiTheme';
import { changePasswordApi } from '../../../services/api/auth';
import { useSnackbar } from 'notistack';

const ChangePasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const theme = useMuiTheme();
    const { token } = useParams(); // Obtém o token da URL
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();

    // Função para validar as senhas e enviar a requisição para o backend
    const handleChangePassword = async () => {
        setIsLoading(true);

        // Validação das senhas no frontend
        if (newPassword !== confirmNewPassword) {
            enqueueSnackbar('As senhas não coincidem.', { variant: 'error' });
            setIsLoading(false);
            return;
        }

        if (!token) {
            enqueueSnackbar('Token de redefinição de senha inválido.', { variant: 'error' });
            setIsLoading(false);
            return;
        }

        try {
            await changePasswordApi(newPassword, token);
            enqueueSnackbar('Senha alterada com sucesso!', { variant: 'success' });
            navigate('/login');
        } catch (error) {
            enqueueSnackbar('Erro ao alterar senha. Verifique os dados e o token.', { variant: 'error' });
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
                padding: theme.spacing(3),
            }}
        >
            <Grid container spacing={0} justifyContent="center" alignItems="center">
                <Grid item xs={12} md={6}>
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
                            Trocar Senha
                        </Typography>

                        <TextField
                            label="Nova Senha"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <TextField
                            label="Confirmar Nova Senha"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />

                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ marginTop: theme.spacing(3), fontWeight: 'bold', fontSize: '1.1rem' }}
                            onClick={handleChangePassword}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Trocar Senha'}
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ChangePasswordPage;
