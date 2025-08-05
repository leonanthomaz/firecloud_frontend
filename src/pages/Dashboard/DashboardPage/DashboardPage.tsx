import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
  useMediaQuery,
  useTheme,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Settings, AttachMoney, BarChart, Circle, TrendingUp, Chat, Receipt } from '@mui/icons-material';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../contexts/AuthContext';
import { getAssistantsApi } from '../../../services/api/assistant';
import { getPaymentsByCompanyApi } from '../../../services/api/payment';
import { getInteractionsByCompany } from '../../../services/api/interaction';
import { ChatbotStatus } from '../../../types/assistant';
import { ResponsiveContainer, Bar, XAxis, YAxis, Tooltip, BarChart as RechartsBarChart, Legend } from 'recharts';

const DashboardPage: React.FC = () => {
    const { getUser, getToken } = useAuth();
    const [assistente, setAssistente] = useState<any>(null);
    const [pagamentos, setPagamentos] = useState<any[]>([]);
    const [interacoes, setInteracoes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [openHelp, setOpenHelp] = useState(false);

    const data = getUser();
    const token = getToken();
    const companyId = data?.company?.id;
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (token && companyId) {
                    const [assistants, payments, interactions] = await Promise.all([
                        getAssistantsApi(token, companyId),
                        getPaymentsByCompanyApi(token, companyId),
                        getInteractionsByCompany(token, companyId)
                    ]);
                    setAssistente(assistants[0]);
                    setPagamentos(payments);
                    setInteracoes(interactions);
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, companyId]);

    // Processa dados para o gráfico
    const processChartData = () => {
        const last7Days = [...Array(7)].map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
        }).reverse();

        const interactionCounts = interacoes.reduce((acc, interaction) => {
            if (!interaction.created_at) return acc;
            
            const date = new Date(interaction.created_at).toLocaleDateString('pt-BR', { 
                day: 'numeric', 
                month: 'short' 
            });
            
            if (last7Days.includes(date)) {
                acc[date] = (acc[date] || 0) + 1;
            }
            
            return acc;
        }, {});

        return last7Days.map(date => ({
            date,
            interactions: interactionCounts[date] || 0
        }));
    };

    const chartData = processChartData();

    const resumo = {
        statusAssistente: assistente?.status === ChatbotStatus.ONLINE ? 'Online' : 'Offline',
        interacoesHoje: interacoes.filter(i => {
            if (!i.created_at) return false;
            const today = new Date().toLocaleDateString();
            return new Date(i.created_at).toLocaleDateString() === today;
        }).length,
        mensalidadesPendentes: pagamentos.filter(p => p.status === 'pending').length,
        totalInteracoes: interacoes.length
    };

    const atividadesRecentes = interacoes
        .slice(0, 5)
        .map((interacao) => ({
            id: interacao.id,
            tipo: interacao.interaction_type,
            descricao: interacao.interaction_summary || 'Interação sem resumo',
            data: interacao.created_at ? new Date(interacao.created_at).toLocaleString() : 'Data desconhecida',
            sentiment: interacao.sentiment
        }));

    const renderSummaryCards = () => {
        const cards = [
            {
                title: "Status do Chatbot",
                value: resumo.statusAssistente,
                icon: <Circle fontSize="small" />,
                color: resumo.statusAssistente === 'Online' ? 'success.main' : 'error.main',
                secondary: assistente?.assistant_name || 'N/A',
            },
            {
                title: "Interações Hoje",
                value: resumo.interacoesHoje,
                icon: <Chat fontSize="small" />,
                color: 'primary.main',
                secondary: `${resumo.totalInteracoes} no total`
            },
            {
                title: "Financeiro",
                value: resumo.mensalidadesPendentes,
                icon: <Receipt fontSize="small" />,
                color: resumo.mensalidadesPendentes > 0 ? 'warning.main' : 'success.main',
                secondary: resumo.mensalidadesPendentes > 0 ? 'Pendente' : 'Em dia'
            }
        ];

        const getPaletteColor = (key: string): string => {
            const [mainKey, subKey] = key.split('.') as [keyof typeof theme.palette, 'main' | 'light' | 'dark'];

            const paletteGroup = theme.palette[mainKey];

            if (paletteGroup && typeof paletteGroup === 'object' && subKey in paletteGroup) {
                return (paletteGroup as any)[subKey];
            }

            // fallback se der ruim
            return theme.palette.grey[500];
        };


        return (
            <Stack 
                direction={isSmallScreen ? 'column' : 'row'} 
                spacing={2} 
                sx={{ mb: 3 }}
            >
                {cards.map((card, index) => (
                    <Card 
                        key={index} 
                        className={index === 0 ? "chatbot-status-card" : ""}
                        sx={{ 
                            flex: 1,
                            minWidth: isSmallScreen ? '100%' : 'auto',
                            boxShadow: theme.shadows[1],
                            borderLeft: `4px solid ${getPaletteColor(card.color)}`
                        }}
                    >
                        <CardContent sx={{ p: isSmallScreen ? 2 : 3 }}>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                <Box sx={{ color: card.color }}>
                                    {card.icon}
                                </Box>
                                <Typography 
                                    variant="subtitle2" 
                                    sx={{ 
                                        textTransform: 'uppercase',
                                        letterSpacing: 1,
                                        fontSize: '0.75rem',
                                        color: 'text.secondary'
                                    }}
                                >
                                    {card.title}
                                </Typography>
                            </Stack>
                            
                            <Typography 
                                variant="h4" 
                                sx={{ 
                                    fontWeight: 'bold',
                                    color: card.color,
                                    mb: 0.5
                                }}
                            >
                                {card.value}
                            </Typography>
                            
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    color: 'text.secondary',
                                    display: 'block'
                                }}
                            >
                                {card.secondary}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        );
    };

    const renderQuickAccess = () => {
        const buttons: {
            text: string;
            icon: React.ReactNode;
            href: string;
            color: 'inherit' | 'primary' | 'secondary' | 'info' | 'success' | 'error' | 'warning';
        }[] = [
            { 
                text: "Configurações", 
                icon: <Settings />, 
                href: '/painel/configuracoes',
                color: 'primary' 
            },
            { 
                text: "Financeiro", 
                icon: <AttachMoney />, 
                href: '/painel/financeiro',
                color: 'secondary' 
            },
            { 
                text: "Estatísticas", 
                icon: <BarChart />, 
                href: '/painel/estatisticas',
                color: 'info' 
            }
        ];

        return (
            <Box sx={{ mb: 3 }}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        mb: 2, 
                        fontWeight: 'bold',
                        fontSize: isSmallScreen ? '1rem' : '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <TrendingUp fontSize="small" />
                    Acesso Rápido
                </Typography>
                <Stack 
                    direction={isSmallScreen ? 'column' : 'row'} 
                    spacing={2}
                    sx={{ width: '100%' }}
                >
                    {buttons.map((button, index) => (
                        <Button
                            key={index}
                            variant="outlined"
                            fullWidth
                            startIcon={button.icon}
                            href={button.href}
                            color={button.color}
                            sx={{ 
                                py: isSmallScreen ? 1.5 : 2,
                                px: 2,
                                justifyContent: 'flex-start',
                                fontSize: isSmallScreen ? '0.875rem' : '1rem',
                                borderWidth: 2,
                                '&:hover': {
                                    borderWidth: 2
                                }
                            }}
                        >
                            {button.text}
                        </Button>
                    ))}
                </Stack>
            </Box>
        );
    };

    const handleOpenAssistant = () => {
    if (assistente?.assistant_link) {
            window.open(assistente.assistant_link, '_blank');
        }
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

    return (
        <Layout withSidebar={true}>
            <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        {/* Cabeçalho */}
                        <Typography 
                            variant={isSmallScreen ? "h5" : "h4"} 
                            gutterBottom
                            sx={{ 
                                fontWeight: 'bold',
                                color: 'primary.main',
                                mt: 8
                            }}
                        >
                            Olá, {data?.user?.first_name || 'Usuário'}!
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: 'text.secondary',
                                maxWidth: '600px',
                                mb: 2,
                                fontSize: isSmallScreen ? '0.7rem' : '1rem'
                            }}
                        >
                            Aqui está um resumo das atividades recentes e métricas importantes do seu chatbot.
                        </Typography>
                    </Box>
                    <Box className="assistant-button">
                        <Button variant="contained"  size='small' onClick={handleOpenAssistant}>{isSmallScreen ? 'Assistente' : 'Ir para assistente'}</Button>
                    </Box>
                </Stack>
                {/* Cards de Resumo */}
                {renderSummaryCards()}

                {/* Links Rápidos */}
                <Box className="quick-access-section">
                    {renderQuickAccess()}
                </Box>

                {/* Gráfico de Interações */}
                <Card className='interactions-chart' sx={{ 
                    mb: 3,
                    boxShadow: theme.shadows[1],
                    borderRadius: 2
                }}>
                    <CardContent>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                mb: 2, 
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <BarChart fontSize="small" />
                            Interações Recentes
                        </Typography>
                        <Box sx={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsBarChart data={chartData}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                    <Legend />
                                <Bar dataKey="interactions" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} name="Tokens" />
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </Box>
                    </CardContent>
                </Card>

                {/* Atividades Recentes */}
                <Card sx={{ 
                    boxShadow: theme.shadows[1],
                    borderRadius: 2
                }}>
                    <CardContent>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                mb: 2, 
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <Chat fontSize="small" />
                            Últimas Interações
                        </Typography>
                        <List>
                            {atividadesRecentes.map((atividade, index) => (
                                <React.Fragment key={atividade.id || index}>
                                    <ListItem 
                                        sx={{ 
                                            px: 0,
                                            py: 2,
                                            '&:hover': {
                                                backgroundColor: 'action.hover'
                                            }
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography 
                                                    variant="body1"
                                                    sx={{ fontWeight: 'medium' }}
                                                >
                                                    {atividade.descricao}
                                                </Typography>
                                            }
                                            secondary={
                                                <Stack 
                                                    direction={isSmallScreen ? 'column' : 'row'} 
                                                    spacing={isSmallScreen ? 0 : 2}
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    <Typography 
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {atividade.tipo}
                                                    </Typography>
                                                    <Typography 
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {atividade.data}
                                                    </Typography>
                                                    {atividade.sentiment && (
                                                        <Chip 
                                                            label={atividade.sentiment} 
                                                            size="small" 
                                                            sx={{ 
                                                                ml: isSmallScreen ? 0 : 1,
                                                                mt: isSmallScreen ? 0.5 : 0,
                                                                backgroundColor: 
                                                                    atividade.sentiment.toLowerCase() === 'positive' ? 'success.light' :
                                                                    atividade.sentiment.toLowerCase() === 'negative' ? 'error.light' : 
                                                                    'warning.light'
                                                            }}
                                                        />
                                                    )}
                                                </Stack>
                                            }
                                        />
                                    </ListItem>
                                    {index < atividadesRecentes.length - 1 && (
                                        <Divider sx={{ my: 0 }} />
                                    )}
                                </React.Fragment>
                            ))}
                        </List>
                    </CardContent>
                </Card>

                <Dialog open={openHelp} onClose={() => setOpenHelp(false)} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ fontWeight: 'bold' }}>Como marcar seus dias disponíveis</DialogTitle>
                    <DialogContent dividers>
                        <Typography gutterBottom>
                            🗓️ <strong>Passo 1:</strong> Escolha um dia no calendário clicando diretamente na data desejada.
                        </Typography>
                        <Typography gutterBottom>
                            ⏰ <strong>Passo 2:</strong> Defina o horário de início e término em que estará disponível nesse dia.
                        </Typography>
                        <Typography gutterBottom>
                            📝 <strong>Passo 3:</strong> Se necessário, marque se o horário será <strong>recorrente</strong> ou apenas para o dia escolhido.
                        </Typography>
                        <Typography gutterBottom>
                            ✅ <strong>Passo 4:</strong> Salve para que os clientes possam visualizar esses horários disponíveis.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={2}>
                            Dica: você pode <strong>arrastar e soltar</strong> os horários já marcados para ajustá-los.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={() => setOpenHelp(false)} 
                            variant="contained" 
                            color="primary"
                            sx={{ borderRadius: '8px' }}
                        >
                            Entendi
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Layout>
    );
};

export default DashboardPage;