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
    Chip,
    Stack,
    useMediaQuery,
    Theme,
    Paper,
    Avatar,
    LinearProgress
} from '@mui/material';
import Layout from '../../../components/Layout';
import { PlanInfo } from '../../../types/plan';
import { useAuth } from '../../../contexts/AuthContext';
import { getPlansApi, getPlanByIdApi } from '../../../services/api/plan';
import { useSnackbar } from 'notistack';
import {
    Star,
    TrendingUp,
    CheckCircle,
    Bolt,
    Diamond,
    WorkspacePremium
} from '@mui/icons-material';

const PlanPage: React.FC = () => {
    const [plans, setPlans] = useState<PlanInfo[]>([]);
    const [currentPlan, setCurrentPlan] = useState<PlanInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const { getToken, state } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const company = state.data?.company;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getToken();
                if (token) {
                    setLoading(true);
                    const [plansData, currentPlanData] = await Promise.all([
                        getPlansApi(),
                        company?.plan_id ? getPlanByIdApi(token, company.plan_id) : Promise.resolve(null)
                    ]);
                    setPlans(plansData);
                    setCurrentPlan(currentPlanData);
                }
            } catch (error) {
                console.error('Erro ao buscar planos:', error);
                enqueueSnackbar('Erro ao carregar planos', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [getToken, company?.plan_id, enqueueSnackbar]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const handleUpgrade = (id: number | undefined) => {
        enqueueSnackbar(`Redirecionando para upgrade do plano ${id}`, { variant: 'info' });
    };

    const getPlanIcon = (planName: string) => {
        if (planName.toLowerCase().includes('premium')) return <Diamond color="secondary" />;
        if (planName.toLowerCase().includes('pro')) return <WorkspacePremium color="primary" />;
        return <Bolt color="warning" />;
    };

    if (loading) {
        return (
            <Layout withSidebar={true}>
                <LinearProgress color="primary" />
            </Layout>
        );
    }

    return (
        <Layout withSidebar={true}>
            <Box>
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: 4, 
                        borderRadius: 4,
                        background: 'linear-gradient(to bottom, #f5f9ff, #ffffff)',
                        mt: 4,
                    }}
                >
                    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                        <Typography 
                            variant={isSmallScreen ? "h5" : "h4"} 
                            sx={{ 
                                mb: 1, 
                                fontWeight: 800,
                                background: 'linear-gradient(45deg, #1976d2 30%, #00bcd4 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textAlign: 'center'
                            }}
                        >
                            Escolha o Melhor Plano para Você
                        </Typography>
                        
                        <Typography 
                            variant="subtitle1" 
                            sx={{ 
                                mb: 4, 
                                color: 'text.secondary',
                                textAlign: 'center',
                                maxWidth: 700,
                                mx: 'auto'
                            }}
                        >
                            Atualize seu plano para desbloquear recursos exclusivos e melhorar sua experiência
                        </Typography>

                        {/* Plano Atual */}
                        {currentPlan && (
                            <Box sx={{ mb: 6 }}>
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        mb: 3,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        color: 'primary.dark'
                                    }}
                                >
                                    <Star color="primary" sx={{ fontSize: 28 }} />
                                    Seu Plano Atual
                                </Typography>

                                <Card sx={{ 
                                    border: 'none',
                                    boxShadow: 3,
                                    background: 'linear-gradient(135deg, #f0f7ff 0%, #e1f0ff 100%)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        width: 120,
                                        height: 'auto',
                                        background: 'radial-gradient(circle, rgba(25,118,210,0.1) 0%, rgba(25,118,210,0) 70%)'
                                    }
                                }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            mb: 2
                                        }}>
                                            <Box>
                                                <Chip 
                                                    label="SEU PLANO" 
                                                    color="primary"
                                                    sx={{ 
                                                        fontWeight: 'bold',
                                                        mb: 1,
                                                        borderRadius: 1
                                                    }}
                                                />
                                                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                                    {currentPlan.name}
                                                </Typography>
                                            </Box>
                                            <Avatar sx={{ 
                                                bgcolor: 'primary.main', 
                                                width: 56, 
                                                height: 56,
                                                fontSize: 24
                                            }}>
                                                {getPlanIcon(currentPlan.name)}
                                            </Avatar>
                                        </Box>
                                        
                                        <Typography variant="h3" sx={{ mb: 3, fontWeight: 800, color: 'primary.main' }}>
                                            {formatCurrency(currentPlan.price)}
                                            <Typography component="span" sx={{ fontSize: '1rem', color: 'text.secondary' }}>
                                                /mês
                                            </Typography>
                                        </Typography>
                                        
                                        <Divider sx={{ my: 2, borderColor: 'primary.light' }} />
                                        
                                        <List dense sx={{ mb: 2 }}>
                                            {currentPlan.description?.split(',').map((feature, index) => (
                                                <ListItem key={index} sx={{ px: 0, py: 1 }}>
                                                    <CheckCircle color="primary" sx={{ mr: 2, fontSize: '1.2rem' }} />
                                                    <ListItemText 
                                                        primary={feature.trim()} 
                                                        primaryTypographyProps={{ 
                                                            fontWeight: 'medium',
                                                            fontSize: '1rem'
                                                        }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Box>
                        )}

                        {/* Planos de Upgrade */}
                        <Box sx={{ mb: 4 }}>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    mb: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    color: 'secondary.dark'
                                }}
                            >
                                <TrendingUp color="secondary" sx={{ fontSize: 28 }} />
                                Conheça Nossos Planos
                            </Typography>

                            <Stack 
                                direction={isSmallScreen ? 'column' : 'row'} 
                                spacing={3} 
                                justifyContent="center"
                                alignItems="stretch"
                                sx={{ mb: 4 }}
                            >
                                {plans
                                    .filter(plan => plan.id !== company?.plan_id)
                                    .sort((a, b) => a.price - b.price)
                                    .map((plan) => (
                                        <Card
                                            key={plan.id}
                                            sx={{
                                                flex: 1,
                                                minWidth: 280,
                                                maxWidth: 350,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                borderRadius: 3,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-8px)',
                                                    boxShadow: '0 16px 24px rgba(0, 0, 0, 0.1)',
                                                    borderColor: 'secondary.light'
                                                },
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                            elevation={0}
                                        >
                                            <CardContent sx={{ 
                                                p: 4,
                                                flexGrow: 1,
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mb: 2
                                                }}>
                                                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                                        {plan.name}
                                                    </Typography>
                                                    <Avatar sx={{ 
                                                        bgcolor: 'secondary.light', 
                                                        width: 48, 
                                                        height: 48,
                                                        color: 'secondary.contrastText'
                                                    }}>
                                                        {getPlanIcon(plan.name)}
                                                    </Avatar>
                                                </Box>
                                                
                                                <Typography variant="h4" sx={{ mb: 3, fontWeight: 800, color: 'secondary.main' }}>
                                                    {formatCurrency(plan.price)}
                                                    <Typography component="span" sx={{ fontSize: '1rem', color: 'text.secondary' }}>
                                                        /mês
                                                    </Typography>
                                                </Typography>
                                                
                                                <Divider sx={{ my: 2 }} />
                                                
                                                <List dense sx={{ mb: 3, flexGrow: 1 }}>
                                                    {plan.description?.split(',').map((feature, index) => (
                                                        <ListItem key={index} sx={{ px: 0, py: 1 }}>
                                                            <CheckCircle color="secondary" sx={{ mr: 2, fontSize: '1.2rem' }} />
                                                            <ListItemText 
                                                                primary={feature.trim()} 
                                                                primaryTypographyProps={{ 
                                                                    fontWeight: 'medium',
                                                                    fontSize: '0.95rem'
                                                                }}
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                                
                                                <Button 
                                                    fullWidth 
                                                    variant="contained" 
                                                    color="secondary" 
                                                    sx={{ 
                                                        mt: 'auto',
                                                        py: 1.5,
                                                        fontWeight: 'bold',
                                                        borderRadius: 2,
                                                        fontSize: '1rem'
                                                    }}
                                                    onClick={() => handleUpgrade(plan.id)}
                                                >
                                                    Assinar Agora
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                            </Stack>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Layout>
    );
};

export default PlanPage;