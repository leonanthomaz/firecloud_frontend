import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Chip,
  useTheme,
  useMediaQuery,
  Theme
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../contexts/AuthContext';
import { InteractionType } from '../../../types/interaction';
import { AssistantInfo, ChatbotStatus } from '../../../types/assistant';
import { getInteractionsByCompany } from '../../../services/api/interaction';
import { getAssistantByCompany } from '../../../services/api/assistant';
import { useCompany } from '../../../contexts/CompanyContext';

const AnalyticsPage: React.FC = () => {
  const theme = useTheme();
  const { getToken, state } = useAuth();
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState<string>('7d');
  const [interactions, setInteractions] = useState<InteractionType[]>([]);
  const [assistant, setAssistant] = useState<AssistantInfo | null>(null);
  const { companyData } = useCompany();
  const company = companyData || state.data?.company;
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = getToken();
        if (token) {
          const [interactionsData, assistantData] = await Promise.all([
            getInteractionsByCompany(token, company?.id ?? 0),
            getAssistantByCompany(token, company?.id ?? 0)
          ]);
          setInteractions(interactionsData);
          setAssistant(assistantData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getToken]);

  const calculateMetrics = () => {
    if (!interactions.length) return {
      totalInteractions: 0,
      totalTokens: 0,
      avgTokens: 0,
      tokenUsagePercentage: 0,
      sentiments: { POSITIVE: 0, NEUTRAL: 0, NEGATIVE: 0 }
    };

    const totalInteractions = interactions.length;
    const totalTokens = interactions.reduce((sum, i) => sum + (i.total_tokens || 0), 0);
    const avgTokens = Math.round(totalTokens / totalInteractions);
    const tokenUsagePercentage = assistant
      ? Math.round((totalTokens / (assistant.assistant_token_limit || 1)) * 100)
      : 0;

    const sentiments = { POSITIVE: 0, NEUTRAL: 0, NEGATIVE: 0 };
    interactions.forEach(i => {
      const s = i.sentiment?.toUpperCase() || 'NEUTRAL';
      if (s in sentiments) sentiments[s as keyof typeof sentiments]++;
    });

    return {
      totalInteractions,
      totalTokens,
      avgTokens,
      tokenUsagePercentage,
      sentiments
    };
  };

  const metrics = calculateMetrics();

  const handleDownloadRelatorio = () => {
    alert('Relatório baixado com sucesso!');
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

    const tokenDataPerDay = interactions.reduce<Record<string, number>>((acc, interaction) => {
      // Se não tiver data válida, ignora essa interação
      if (!interaction.created_at) return acc;

      const date = new Date(interaction.created_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + (interaction.total_tokens || 0);
      return acc;
    }, {});


    const tokenBarChartData = Object.entries(tokenDataPerDay).map(([date, tokens]) => ({
      date,
      tokens,
    }));

  return (
      <Layout withSidebar={true}>
          <Box>
            {/* Cabeçalho */}
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', md: 'center' }}
              spacing={{ xs: 2, md: 0 }}
              sx={{ mb: 1, mt: 8, px: 2 }}
            >
              <Typography 
                    variant={isSmallScreen ? "h5" : "h4"} 
                    align="center" 
                    gutterBottom
                    sx={{ 
                        fontWeight: 'bold',
                        color: 'primary.main',
                        mb: 4
                    }}
                >
                    Estatísticas e Análises
              </Typography>
 
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mt: { xs: 1, md: 0 }, width: { xs: '100%', md: 'auto' }, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}
              >
                <FormControl sx={{ minWidth: 120 }} size="small" fullWidth={false}>
                  <InputLabel>Período</InputLabel>
                  <Select
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value as string)}
                    label="Período"
                  >
                    <MenuItem value="7d">Últimos 7 dias</MenuItem>
                    <MenuItem value="30d">Últimos 30 dias</MenuItem>
                    <MenuItem value="90d">Últimos 90 dias</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="contained" startIcon={<Download />} onClick={handleDownloadRelatorio}>
                  Baixar Relatório
                </Button>
              </Stack>
            
            </Stack>
            
            {/* Assistente Info */}
            {assistant && (
              <Card sx={{ mb: 1 }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6">Assistente: {assistant.assistant_name}</Typography>
                      <Typography variant="body2">
                        Modelo: {assistant.assistant_model} | Status:
                        <Chip
                          label={assistant.status}
                          size="small"
                          color={assistant.status === ChatbotStatus.ONLINE ? 'success' : 'error'}
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="body2">
                        Limite de tokens: {assistant.assistant_token_limit?.toLocaleString()}
                      </Typography>
                      <Typography variant="body2">
                        Reset em: {new Date(assistant.assistant_token_reset_date || '').toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            )}

            {/* Métricas */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} mb={1}>
              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">Total de Interações</Typography>
                  <Typography variant="h3" sx={{ mt: 1 }}>{metrics.totalInteractions}</Typography>
                </CardContent>
              </Card>
              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">Tokens Consumidos</Typography>
                  <Typography variant="h3" sx={{ mt: 1 }}>{metrics.totalTokens.toLocaleString()}</Typography>
                  <Typography variant="caption">{metrics.tokenUsagePercentage}% do limite</Typography>
                </CardContent>
              </Card>
              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">Média de Tokens/Interação</Typography>
                  <Typography variant="h3" sx={{ mt: 1 }}>{metrics.avgTokens}</Typography>
                </CardContent>
              </Card>
            </Stack>

            {/* Gráficos */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} mb={1}>
              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Consumo de Tokens</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tokenBarChartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="tokens" fill={theme.palette.primary.main} name="Tokens" />
                  </BarChart>
                </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Sentimento das Interações</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Positivo', value: metrics.sentiments.POSITIVE },
                        { name: 'Neutro', value: metrics.sentiments.NEUTRAL },
                        { name: 'Negativo', value: metrics.sentiments.NEGATIVE },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                      dataKey="value"
                    >
                      {['#4caf50', '#ff9800', '#f44336'].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>

                </CardContent>
              </Card>
            </Stack>

            {/* Últimas Interações */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Últimas Interações</Typography>
                <Stack spacing={2}>
                  {interactions.slice(0, 5).map((interaction) => (
                    <Card key={interaction.id} variant="outlined">
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between">
                          <Box>
                            <Typography variant="subtitle2">
                              {interaction.created_at ? new Date(interaction.created_at).toLocaleString() : 'Data Indisponível'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {interaction.interaction_type?.toUpperCase()} - Sentimento: {interaction.sentiment}
                              <br />
                              Prompt: {interaction.prompt_tokens} | Completion: {interaction.completion_tokens}
                            </Typography>
                          </Box>
                          <Chip label={`${interaction.total_tokens} tokens`} size="small" color="primary" />
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Box>
      </Layout>
  );
};

export default AnalyticsPage;
