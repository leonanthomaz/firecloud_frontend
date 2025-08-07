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
import { Settings, AttachMoney, BarChart, Circle, SmartToy, TrendingUp, Chat, Receipt, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
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
            },
            { 
                text: "Assistente", 
                icon: <SmartToy />, 
                href: '/painel/assistente',
                color: 'secondary' 
            },
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

    // tradução separada
    const SentimentLabels = {
        POSITIVE: 'Positivo',
        NEGATIVE: 'Negativo',
        NEUTRAL: 'Neutro',
    } as const;

    // função cor que você já tem
    const getSentimentColor = (sentiment: string): string => {
        switch (sentiment.toUpperCase()) {
            case 'POSITIVE':
            return 'success.light';
            case 'NEGATIVE':
            return 'error.light';
            default:
            return 'warning.light';
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
                {/* Cabeçalho Reorganizado */}
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: isSmallScreen ? 'column' : 'row', 
                    justifyContent: 'space-between', 
                    alignItems: isSmallScreen ? 'flex-start' : 'center',
                    mt: 8, mb: 3,
                }}>
                    <Box>
                        <Typography 
                            variant={isSmallScreen ? "h5" : "h4"} 
                            sx={{ 
                                fontWeight: 'bold',
                                color: 'primary.main',
                                lineHeight: 1.2
                            }}
                        >
                            Olá, {data?.user?.first_name || 'Usuário'}!
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: 'text.secondary',
                                mt: 0.5,
                                fontSize: isSmallScreen ? '0.875rem' : '1rem'
                            }}
                        >
                            Aqui está um resumo das atividades do seu chatbot
                        </Typography>
                    </Box>
                    
                    <Button
                        className="assistant-button"
                        variant="contained"
                        color="secondary"
                        startIcon={<OpenInNewIcon />}
                        onClick={handleOpenAssistant}
                        sx={{
                            minWidth: isSmallScreen ? '100%' : 180,
                            py: 1.5,
                            fontSize: '0.875rem',
                            ...(isSmallScreen && { mt: 1 })
                        }}
                    >
                        Acessar Assistente
                    </Button>
                </Box>

                {/* Seção de Resumo */}
                <Box sx={{ mb: 4 }}>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            mb: 2,
                            fontWeight: 'bold',
                            color: 'text.primary',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <TrendingUp fontSize="small" />
                        Visão Geral
                    </Typography>
                    {renderSummaryCards()}
                </Box>

                {/* Seção de Acesso Rápido */}
                <Box className="quick-access-section" sx={{ mb: 4 }}>
                    {renderQuickAccess()}
                </Box>

                {/* Grid de Conteúdo Principal */}
                <Box className='interactions-chart' sx={{ 
                    display: 'grid',
                    gridTemplateColumns: isSmallScreen ? '1fr' : '1fr 1fr',
                    gap: 3,
                }}>
                    {/* Gráfico de Interações */}
                    <Card sx={{ 
                        boxShadow: theme.shadows[1],
                        borderRadius: 2,
                        height: '100%',
                        gridColumn: isSmallScreen ? '1 / -1' : 'span 1'
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
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsBarChart data={chartData}>
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar 
                                            dataKey="interactions" 
                                            fill={theme.palette.primary.main} 
                                            radius={[4, 4, 0, 0]} 
                                            name="Interações" 
                                        />
                                    </RechartsBarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Atividades Recentes */}
                    <Card sx={{ 
                        boxShadow: theme.shadows[1],
                        borderRadius: 2,
                        height: '100%',
                        gridColumn: isSmallScreen ? '1 / -1' : 'span 1'
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
                            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                                {atividadesRecentes.map((atividade, index) => (
                                    <React.Fragment key={atividade.id || index}>
                                        <ListItem 
                                            sx={{ 
                                                px: 0,
                                                py: 1.5,
                                                '&:hover': {
                                                    backgroundColor: 'action.hover'
                                                }
                                            }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Typography 
                                                        variant="body2"
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
                                                        divider={
                                                            !isSmallScreen ? (
                                                                <Circle sx={{ fontSize: 4, color: 'divider' }} />
                                                            ) : null
                                                        }
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
                                                                label={SentimentLabels[atividade.sentiment.toUpperCase() as keyof typeof SentimentLabels] || atividade.sentiment}
                                                                size="small"
                                                                sx={{ backgroundColor: getSentimentColor(atividade.sentiment) }}
                                                            />
                                                        )}


                                                    </Stack>
                                                }
                                            />
                                        </ListItem>
                                        {index < atividadesRecentes.length - 1 && (
                                            <Divider sx={{ my: 0 }} component="li" />
                                        )}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Layout>
    );
};

export default DashboardPage;