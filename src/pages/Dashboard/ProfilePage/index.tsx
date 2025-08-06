import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock, AlternateEmail } from '@mui/icons-material';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../contexts/AuthContext';
import { useSnackbar } from 'notistack';
import { updateUserApi, updateUserPassword } from '../../../services/api/user';

const ProfilePage: React.FC = () => {
  const { state, user, getToken, updateUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const currentUser = state.data?.user
  const token = getToken()
  
  const [formData, setFormData] = useState({
    first_name: '',
    username: '',
    is_admin: currentUser?.is_admin || false
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [errors, setErrors] = useState({
    password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        first_name: currentUser.first_name || '',
        username: currentUser.username || '',
        is_admin: currentUser.is_admin || false,
      });
    }
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    // Validação de senha
    if (name === 'new_password') {
      setErrors(prev => ({
        ...prev,
        password: value.length < 8 ? 'A senha deve ter pelo menos 8 caracteres' : ''
      }));
    } else if (name === 'confirm_password') {
      setErrors(prev => ({
        ...prev,
        confirm_password: value !== passwordData.new_password ? 'As senhas não coincidem' : ''
      }));
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser || !getToken) return;
    console.log("formData", formData)
    setIsLoading(true);
    try {
      const updatedUser = await updateUserApi(token ?? '', currentUser.id, formData);
      updateUser(updatedUser);
      enqueueSnackbar('Perfil atualizado com sucesso!', { variant: 'success' });
      setIsEditing(false);
    } catch (error) {
      enqueueSnackbar('Erro ao atualizar perfil', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePassword = async () => {
    if (!user || !getToken || !currentUser || errors.password || errors.confirm_password) return;

    setIsLoading(true);
    try {
      const payload = {
        current_password: currentUser.is_register_google ? 'google' : passwordData.current_password,
        new_password: passwordData.new_password
      };

      await updateUserPassword(token ?? '', currentUser.id, payload);

      enqueueSnackbar('Senha alterada com sucesso!', { variant: 'success' });
      setIsPasswordEditing(false);
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      enqueueSnackbar('Erro ao alterar senha. Verifique sua senha atual.', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Layout withSidebar={true}>
      <Box>
        <Typography variant={isMobile ? "h5" : "h4"} sx={{ mt: 8, mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
          Meu Perfil
        </Typography>

        {/* Seção de Informações do Perfil */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">Informações Pessoais</Typography>
              {isEditing ? (
                <Box>
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={() => setIsEditing(false)}
                    sx={{ mr: 2 }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                  >
                    {isLoading ? <CircularProgress size={24} /> : 'Salvar'}
                  </Button>
                </Box>
              ) : (
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </Button>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Nome"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                disabled={!isEditing}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Nome de Usuário"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={!isEditing}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AlternateEmail />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Seção de Alteração de Senha */}
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">Alterar Senha</Typography>
              {isPasswordEditing ? (
                <Box>
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={() => setIsPasswordEditing(false)}
                    sx={{ mr: 2 }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSavePassword}
                    disabled={
                      isLoading || 
                      !passwordData.current_password || 
                      !passwordData.new_password || 
                      !!errors.password || 
                      !!errors.confirm_password
                    }
                  >
                    {isLoading ? <CircularProgress size={24} /> : 'Salvar Senha'}
                  </Button>
                </Box>
              ) : (
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => setIsPasswordEditing(true)}
                >
                  Alterar Senha
                </Button>
              )}
            </Box>

            {isPasswordEditing && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                
                {!currentUser?.is_register_google ? (
                  <TextField
                    label="Senha Atual"
                    name="current_password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            edge="end"
                          >
                            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                ) : (
                  <Alert severity="info">
                    Como você se cadastrou com o Google, não é necessário informar a senha atual.
                  </Alert>
                )}

                <TextField
                  label="Nova Senha"
                  name="new_password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Confirmar Nova Senha"
                  name="confirm_password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  error={!!errors.confirm_password}
                  helperText={errors.confirm_password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Alert severity="info">
                  A senha deve conter pelo menos 8 caracteres.
                </Alert>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default ProfilePage;