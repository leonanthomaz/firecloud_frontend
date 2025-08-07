import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Switch, 
  TextField, 
  FormControlLabel, 
  Stack,
  IconButton,
  InputAdornment,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Paper,
  Chip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import Layout from '../../../components/Layout';
import { AssistantInfo } from '../../../types/assistant';
import { useAuth } from '../../../contexts/AuthContext';
import { useSnackbar } from 'notistack';
import { getAssistantByCompany, updateAssistantApi, updateAssistantStatusApi } from '../../../services/api/assistant';
import { useCompany } from '../../../contexts/CompanyContext';
import { useGlobal } from '../../../contexts/GlobalContext';
import { TokenUsageSection } from './TokenUsage';

const ASSISTANT_TYPES = [
  { value: 'receptionist', label: 'Recepcionista', available: true },
  { value: 'sales_assistant', label: 'Assistente de Vendas', available: false },
  { value: 'support_assistant', label: 'Assistente de Suporte', available: false },
  { value: 'booking_agent', label: 'Agente de Agendamentos', available: false },
  { value: 'hr_assistant', label: 'Assistente de RH', available: false }
];

const AssistantPage: React.FC = () => {
  const { getToken, state } = useAuth();
  const { companyData: currentCompany } = useCompany()
  const { isLoading, setLoading } = useGlobal();
  const { enqueueSnackbar } = useSnackbar();
  const [assistant, setAssistant] = useState<AssistantInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    assistant_name: '',
    assistant_api_key: '',
    assistant_type: '',
    status: 'active'
  });
  const [saving, setSaving] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const token = getToken();
  const company = currentCompany || state.data?.company;

  useEffect(() => {
    const fetchAssistant = async () => {
      if (company?.id && token) {
        setLoading(true);
        try {
          const data = await getAssistantByCompany(token, company?.id ?? 0);
          setAssistant(data);
          setFormData({
            assistant_name: data.assistant_name || '',
            assistant_api_key: data.assistant_api_key || '',
            assistant_type: data.assistant_type || 'receptionist',
            status: data.status || 'active'
          });
        } catch (error) {
          enqueueSnackbar('Erro ao carregar dados da assistente', { variant: 'error' });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAssistant();
  }, []);

  const handleCopyLink = () => {
    if (assistant?.assistant_link) {
      navigator.clipboard.writeText(assistant.assistant_link);
      enqueueSnackbar('Link copiado para a área de transferência!', { variant: 'success' });
    }
  };

  const handleOpenAssistant = () => {
    if (assistant?.assistant_link) {
      window.open(assistant.assistant_link, '_blank');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!currentCompany?.id || !token || !assistant?.id) return;

    setSaving(true);
    try {
      const updatedAssistant = await updateAssistantApi(
        token,
        currentCompany.id,
        assistant.id,
        {
          assistant_name: formData.assistant_name,
          assistant_api_key: formData.assistant_api_key,
          assistant_type: formData.assistant_type,
          status: formData.status
        }
      );
      setAssistant(updatedAssistant);
      setIsEditing(false);
      enqueueSnackbar('Configurações atualizadas com sucesso!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Erro ao atualizar assistente', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const toggleAssistantStatus = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.target.checked ? 'ONLINE' : 'OFFLINE';
    if (!token || !company?.id || !assistant?.id) return;

    try {
      const updated = await updateAssistantStatusApi(token, company.id, assistant.id, newStatus);
      setAssistant(updated);
      enqueueSnackbar(`Assistente ${newStatus === 'ONLINE' ? 'ativada' : 'desativada'} com sucesso!`, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Erro ao alterar status da assistente.', { variant: 'error' });
    }
  };

  if (isLoading) {
    return (
      <Layout withSidebar={true}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (!assistant) {
    return (
      <Layout withSidebar={true}>
        <Box>
          <Typography variant={isMobile ? "h5" : "h4"} sx={{ mt: 8, mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
            Assistente
          </Typography>
          <Typography>Nenhuma assistente configurada para esta empresa.</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout withSidebar={true}>
      <Box>
        {/* Header com status destacado */}
        <Paper elevation={0} sx={{ 
          mt: 8, 
          mb: 5,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2
        }}>
          <Stack direction={isMobile ? "column" : "row"} justifyContent="space-between" alignItems="center" spacing={2}>
            <Box>
              <Typography variant={isMobile ? "h5" : "h4"} sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                Configurações da Assistente
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Personalize o comportamento e as configurações da sua assistente virtual.
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip 
                label={assistant?.status === 'ONLINE' ? 'Online' : 'Offline'} 
                color={assistant?.status === 'ONLINE' ? 'success' : 'default'}
                icon={<PowerSettingsNewIcon fontSize="small" />}
                variant="outlined"
              />
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={assistant?.status === 'ONLINE'}
                      onChange={toggleAssistantStatus}
                      color="primary"
                      size="medium"
                    />
                  }
                  label={
                    <Typography variant="body2" color="textSecondary">
                      {assistant?.status === 'ONLINE' ? 'Desativar assistente' : 'Ativar assistente'}
                    </Typography>
                  }
                  labelPlacement="start"
                />
              </Box>
            </Box>
          </Stack>
        </Paper>

        <TokenUsageSection assistant={assistant} />

        {/* Seção Link */}
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            {assistant.assistant_link && (
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ mb: 1 }}>Link da Assistente</Typography>
                <TextField
                  value={assistant.assistant_link}
                  variant="outlined"
                  fullWidth
                  disabled
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleCopyLink} color="primary">
                          <ContentCopyIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: theme.palette.background.default
                    }
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<OpenInNewIcon />}
                  onClick={handleOpenAssistant}
                  sx={{ 
                    alignSelf: 'flex-start',
                    borderRadius: 1,
                    textTransform: 'none',
                    px: 3,
                    py: 1
                  }}
                >
                  Acessar Assistente
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>

        {/* Seção Configurações Editáveis */}
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">{isMobile ? "Configurações" : "Configurações Personalizadas"}</Typography>
              {isEditing ? (
                <Box>
                  <Button 
                    variant="outlined" 
                    color="inherit" 
                    onClick={() => setIsEditing(false)}
                    sx={{ mr: 2, borderRadius: 1 }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ borderRadius: 1 }}
                  >
                    {saving ? <CircularProgress size={24} /> : 'Salvar Alterações'}
                  </Button>
                </Box>
              ) : (
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => setIsEditing(true)}
                  sx={{
                      minWidth: isMobile ? '30%' : 180,
                      py: isMobile ? 0.5 : 1.5,
                      fontSize: '0.875rem',
                      ...(isMobile && { mt: 1 })
                  }}
                >
                  {isMobile ? "Editar" : "Editar Configurações"}
                </Button>
              )}
            </Box>
            
            <Stack spacing={3}>
              <TextField
                label="Nome da Assistente"
                name="assistant_name"
                value={formData.assistant_name}
                onChange={handleInputChange}
                fullWidth
                disabled={!isEditing}
                helperText="Escolha um nome para identificar sua assistente"
                variant="outlined"
                size="small"
              />

              <FormControl fullWidth size="small">
                <InputLabel id="assistant-type-label">Tipo de Assistente</InputLabel>
                <Select
                  labelId="assistant-type-label"
                  id="assistant-type"
                  name="assistant_type"
                  value={formData.assistant_type}
                  onChange={handleSelectChange}
                  label="Tipo de Assistente"
                  disabled={!isEditing}
                >
                  {ASSISTANT_TYPES.map((type) => (
                    <MenuItem 
                      key={type.value} 
                      value={type.value} 
                      disabled={!type.available}
                    >
                      {type.label} {!type.available && (
                        <Chip label="Em breve" size="small" sx={{ ml: 1 }} />
                      )}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {isEditing && (
                <Alert severity="info" sx={{ borderRadius: 1 }}>
                  Configure o tipo de assistente de acordo com a função que ela irá desempenhar.
                  Isso influenciará no comportamento e respostas do seu chatbot.
                </Alert>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Seção Informações da API */}
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Informações Técnicas
            </Typography>
            
            <Stack spacing={2} mt={3}>
              <TextField
                label="URL da API"
                value={assistant.assistant_api_url || 'Não configurado'}
                variant="outlined"
                fullWidth
                disabled
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: theme.palette.background.default,
                  }
                }}
              />
              
              <TextField
                label="Modelo de IA"
                value={assistant.assistant_model || 'Não especificado'}
                variant="outlined"
                fullWidth
                disabled
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: theme.palette.background.default
                  }
                }}
              />
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default AssistantPage;