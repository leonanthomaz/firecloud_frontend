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
  useMediaQuery
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Layout from '../../../components/Layout';
import { AssistantInfo } from '../../../types/assistant';
import { useAuth } from '../../../contexts/AuthContext';
import { useSnackbar } from 'notistack';
import { getAssistantByCompany, updateAssistantApi, updateAssistantStatusApi } from '../../../services/api/assistant';
import { useCompany } from '../../../contexts/CompanyContext';
import { useGlobal } from '../../../contexts/GlobalContext';
import { TokenUsageSection } from './TokenUsage';
// import { FireCreditSection } from './TokenUsage';

// Tipos de assistente disponíveis
const ASSISTANT_TYPES = [
  { value: 'receptionist', label: 'Recepcionista' },
  { value: 'sales_assistant', label: 'Assistente de Vendas' },
  { value: 'support_assistant', label: 'Assistente de Suporte' },
  { value: 'booking_agent', label: 'Agente de Agendamentos' },
  { value: 'hr_assistant', label: 'Assistente de RH' }
];

const AssistantPage: React.FC = () => {
  const { getToken, state } = useAuth();
  const { companyData: currentCompany } = useCompany()
  const{ isLoading, setLoading } = useGlobal();
  const { enqueueSnackbar } = useSnackbar();
  const [assistant, setAssistant] = useState<AssistantInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
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

  const handleCopyApiKey = () => {
    if (formData.assistant_api_key) {
      navigator.clipboard.writeText(formData.assistant_api_key);
      enqueueSnackbar('Chave API copiada!', { variant: 'success' });
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

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      status: e.target.checked ? 'active' : 'inactive'
    }));
  };

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
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
      setShowApiKey(false);
      enqueueSnackbar('Configurações atualizadas com sucesso!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Erro ao atualizar assistente', { variant: 'error' });
    } finally {
      setSaving(false);
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
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant={isMobile ? "h5" : "h4"} sx={{ mt: 8, mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
              Configurações da Assistente
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Personalize o comportamento e as configurações da sua assistente virtual.
            </Typography>
          </Box>
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={assistant?.status === 'ONLINE'}
                  onChange={async (e) => {
                    const newStatus = e.target.checked ? 'ONLINE' : 'OFFLINE';
                    if (!token || !company?.id || !assistant?.id) return;

                    try {
                      const updated = await updateAssistantStatusApi(token, company.id, assistant.id, newStatus);
                      setAssistant(updated);
                      enqueueSnackbar(`Assistente ${newStatus === 'ONLINE' ? 'ativada' : 'desativada'} com sucesso!`, { variant: 'success' });
                    } catch (error) {
                      enqueueSnackbar('Erro ao alterar status da assistente.', { variant: 'error' });
                    }
                  }}
                  color="primary"
                />
              }
              label={assistant?.status === 'ONLINE' ? 'Online' : 'Offline'}
            />
          </Box>
        </Stack>

        {/* <FireCreditSection assistant={assistant} /> */}
        <TokenUsageSection assistant={assistant} />

        {/* Seção Status e Link */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Status da Assistente</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.status === 'active'}
                    onChange={handleStatusChange}
                    color="primary"
                    disabled={!isEditing}
                  />
                }
                label={formData.status === 'active' ? 'Ativa' : 'Inativa'}
              />
            </Stack>

            {assistant.assistant_link && (
              <Stack spacing={2}>
                <Typography variant="h6">Link da Assistente</Typography>
                <TextField
                  value={assistant.assistant_link}
                  variant="outlined"
                  fullWidth
                  disabled
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleCopyLink}>
                          <ContentCopyIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<OpenInNewIcon />}
                  onClick={handleOpenAssistant}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Acessar Assistente
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>

        {/* Seção Configurações Editáveis */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">Configurações Personalizadas</Typography>
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
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? <CircularProgress size={24} /> : 'Salvar'}
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
            
            <Stack spacing={3}>
              <TextField
                label="Nome da Assistente"
                name="assistant_name"
                value={formData.assistant_name}
                onChange={handleInputChange}
                fullWidth
                disabled={!isEditing}
                helperText="Escolha um nome para identificar sua assistente"
              />

              <FormControl fullWidth>
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
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                label="Chave da API"
                name="assistant_api_key"
                type={showApiKey ? 'text' : 'password'}
                value={formData.assistant_api_key}
                onChange={handleInputChange}
                fullWidth
                disabled={!isEditing}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {isEditing ? (
                        <IconButton onClick={toggleShowApiKey}>
                          {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      ) : (
                        <IconButton onClick={handleCopyApiKey}>
                          <ContentCopyIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
                helperText={isEditing ? "Cole aqui a chave da API do seu provedor de IA" : undefined}
              />

              {isEditing && (
                <Alert severity="info">
                  Configure o tipo de assistente de acordo com a função que ela irá desempenhar.
                  Isso influenciará no comportamento e respostas do seu chatbot.
                </Alert>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Seção Informações da API (somente leitura) */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Informações Técnicas
            </Typography>
            
            <Stack spacing={3}>
              <TextField
                label="URL da API"
                value={assistant.assistant_api_url || 'Não configurado'}
                variant="outlined"
                fullWidth
                disabled
              />
              
              <TextField
                label="Modelo de IA"
                value={assistant.assistant_model || 'Não especificado'}
                variant="outlined"
                fullWidth
                disabled
              />
            </Stack>
          </CardContent>
        </Card>

      </Box>
    </Layout>
  );
};

export default AssistantPage;