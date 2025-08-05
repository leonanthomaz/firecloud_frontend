import { useState, useEffect } from 'react';
import { 
    Container, 
    Typography, 
    Box, 
    Card, 
    CardContent, 
    Button, 
    Stack, 
    useMediaQuery,
    Theme,
    Divider,
    Chip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    TextField,
} from '@mui/material';
import Layout from '../../../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
    EmojiEmotions,
    RocketLaunch,
    Diamond,
    CheckCircle,
    Close,
    Add,
    Remove
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import { getCreditsApi } from '../../../services/api/credit';
import { getPlanByIdApi } from '../../../services/api/plan';
import { Credit, CreditOrigin } from '../../../types/credit';
import { PlanInfo } from '../../../types/plan';
import { PaymentType } from '../../../types/payment_item';
import { createPaymentApi } from '../../../services/api/payment';

const CreditPage = () => {
    const navigate = useNavigate();
    const { state } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const [selectedCredit, setSelectedCredit] = useState<number | null>(null);
    const [credits, setCredits] = useState<Credit[]>([]);
    const [planDetails, setPlanDetails] = useState<Record<number, PlanInfo>>({});
    const [loading, setLoading] = useState(true);
    const { getToken } = useAuth();
    const [openModal, setOpenModal] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [processingPayment, setProcessingPayment] = useState(false);

    const company = state.data?.company;

    useEffect(() => {
        const fetchCredits = async () => {
            try {
                const token = getToken();
                
                if (token) {
                    // Busca créditos disponíveis
                    setLoading(true);
                    const creditsData = await getCreditsApi();
                    setCredits(creditsData);

                    // Busca detalhes dos planos associados aos créditos
                    const planPromises = creditsData
                        .filter(credit => credit.origin === 'PLAN' && credit.plan_id)
                        .map(credit => getPlanByIdApi(token, credit.plan_id!));

                    const planResults = await Promise.all(planPromises);
                    
                    const planDetailsMap = planResults.reduce((acc, plan) => {
                        if (plan) {
                            acc[plan.id!] = plan;
                        }
                        return acc;
                    }, {} as Record<number, PlanInfo>);

                    setPlanDetails(planDetailsMap);
                }
            } catch (error) {
                setLoading(false);
                console.error('Erro ao buscar créditos:', error);
                enqueueSnackbar('Erro ao carregar pacotes de crédito', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchCredits();
    }, [getToken, enqueueSnackbar]);

    const handleSelectCredit = (id: number) => {
        setSelectedCredit(id);
        enqueueSnackbar('Pacote selecionado!', { variant: 'info', autoHideDuration: 2000 });
    };

    const handleOpenModal = () => {
        if (!selectedCredit) {
            enqueueSnackbar('Selecione um pacote para continuar', { variant: 'error' });
            return;
        }
        setQuantity(1);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1) return;
        if (newQuantity > 100) {
            enqueueSnackbar('Quantidade máxima é 100', { variant: 'warning' });
            return;
        }
        setQuantity(newQuantity);
    };

    const handleContinueToPayment = async () => {
        if (!selectedCredit) {
            enqueueSnackbar('Selecione um pacote para continuar', { variant: 'error' });
            return;
        }

        try {
            setProcessingPayment(true);
            const token = getToken();
            if (!token) {
                throw new Error('Usuário não autenticado');
            }

            // Encontra o crédito selecionado
            const selectedCreditData = credits.find(c => c.id === selectedCredit);
            if (!selectedCreditData) {
                throw new Error('Pacote de crédito não encontrado');
            }

            // Cria o pagamento
            const paymentResponse = await createPaymentApi(token, {
                type: PaymentType.CREDIT,
                reference_id: selectedCredit,
                quantity,
                amount: selectedCreditData.price * quantity,
                description: `Compra de ${quantity} ${selectedCreditData.name}`,
                total: selectedCreditData.price * quantity,
                company_id: company?.id || 0,
                credit_id: selectedCredit
            });

            // Navega para a página de pagamento com o ID do pagamento
            navigate(`/painel/pagamentos/${paymentResponse.id}`);

        } catch (error) {
            console.error('Erro ao processar pagamento:', error);
            enqueueSnackbar('Erro ao processar pagamento', { variant: 'error' });
        } finally {
            setProcessingPayment(false);
            handleCloseModal();
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const getIconByOrigin = (origin: CreditOrigin) => {
        switch (origin) {
            case 'PLAN':
                return <EmojiEmotions fontSize="large" color="primary" />;
            case 'PACKAGE':
                return <RocketLaunch fontSize="large" color="secondary" />;
            case 'BONUS':
                return <Diamond fontSize="large" color="warning" />;
            default:
                return <CheckCircle fontSize="large" color="success" />;
        }
    };

    const getConversationEstimate = (tokens: number) => {
        // Estimativa média de 5 tokens por palavra e 30 palavras por mensagem
        const messages = Math.floor(tokens / 150); // 5 * 30 = 150 tokens por mensagem
        return messages > 1000 ? `${Math.floor(messages / 1000)}k+` : messages;
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
        <Layout>
            <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
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
                    Compre créditos para seu Chatbot
                </Typography>
                
                <Typography 
                    variant="body1" 
                    align="center" 
                    sx={{ mb: 4, color: 'text.secondary' }}
                >
                    Escolha o pacote de créditos que melhor atende suas necessidades e continue conversando com seu assistente.
                </Typography>

                {credits.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="textSecondary">
                            Nenhum pacote de crédito disponível no momento
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Stack 
                            direction={isSmallScreen ? 'column' : 'row'} 
                            spacing={3} 
                            justifyContent="center"
                            alignItems={isSmallScreen ? 'center' : 'stretch'}
                            sx={{ mb: 4 }}
                        >
                            {credits.map((credit) => (
                                <Box 
                                    key={credit.id} 
                                    sx={{ 
                                        width: isSmallScreen ? '100%' : 300,
                                        position: 'relative'
                                    }}
                                >
                                    {credit.origin === 'PACKAGE' && (
                                        <Chip 
                                            label="RECOMENDADO" 
                                            color="primary"
                                            size="small"
                                            sx={{ 
                                                position: 'absolute',
                                                top: -10,
                                                right: 20,
                                                fontWeight: 'bold',
                                                zIndex: 1
                                            }}
                                        />
                                    )}
                                    
                                    <Card
                                        onClick={() => handleSelectCredit(credit.id)}
                                        sx={{
                                            cursor: 'pointer',
                                            height: '100%',
                                            border: selectedCredit === credit.id ? '2px solid' : '1px solid',
                                            borderColor: selectedCredit === credit.id ? 'primary.main' : 'divider',
                                            boxShadow: selectedCredit === credit.id ? 3 : 1,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: 4,
                                                borderColor: 'primary.light'
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mb: 2
                                            }}>
                                                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                                    {credit.name || `Crédito ${credit.origin}`}
                                                </Typography>
                                                {getIconByOrigin(credit.origin)}
                                            </Box>
                                            
                                            <Divider sx={{ my: 2 }} />
                                            
                                            <Box sx={{ 
                                                display: 'flex', 
                                                justifyContent: 'center',
                                                mb: 3
                                            }}>
                                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                                    {formatCurrency(credit.price)}
                                                </Typography>
                                            </Box>
                                            
                                            <Box sx={{ mb: 3 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <CheckCircle color="success" sx={{ mr: 1, fontSize: '1rem' }} />
                                                    <Typography variant="body2">
                                                        {credit.token_amount.toLocaleString('pt-BR')} tokens
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <CheckCircle color="success" sx={{ mr: 1, fontSize: '1rem' }} />
                                                    <Typography variant="body2">
                                                        {getConversationEstimate(credit.token_amount)} conversas estimadas
                                                    </Typography>
                                                </Box>

                                                {/* Mostra informações adicionais do plano se for um crédito de plano */}
                                                {credit.origin === 'PLAN' && credit.plan_id && planDetails[credit.plan_id] && (
                                                    <>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                            <CheckCircle color="success" sx={{ mr: 1, fontSize: '1rem' }} />
                                                            <Typography variant="body2">
                                                                {planDetails[credit.plan_id].max_users || 'Ilimitados'} usuários
                                                            </Typography>
                                                        </Box>
                                                        {planDetails[credit.plan_id].max_api_calls && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                                <CheckCircle color="success" sx={{ mr: 1, fontSize: '1rem' }} />
                                                                <Typography variant="body2">
                                                                    {planDetails[credit.plan_id].max_api_calls} chamadas API
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </>
                                                )}
                                            </Box>
                                            
                                            {selectedCredit === credit.id && (
                                                <Box sx={{
                                                    backgroundColor: 'primary.light',
                                                    color: 'primary.contrastText',
                                                    p: 1,
                                                    borderRadius: 1,
                                                    textAlign: 'center',
                                                    mb: 2
                                                }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        Selecionado
                                                    </Typography>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Box>
                            ))}
                        </Stack>

                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center',
                            mt: 4
                        }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleOpenModal}
                                disabled={!selectedCredit}
                                sx={{
                                    px: 6,
                                    py: 2,
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                Continuar para Pagamento
                            </Button>
                        </Box>
                    </>
                )}

                <Box sx={{ 
                    mt: 4, 
                    p: 3, 
                    backgroundColor: 'action.hover', 
                    borderRadius: 2,
                    textAlign: 'center'
                }}>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        Os créditos são válidos por 30 dias após a compra. Conversas estimadas podem variar 
                        dependendo da complexidade das interações com o chatbot.
                    </Typography>
                </Box>

                {/* Modal de seleção de quantidade */}
                <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" fontWeight="bold">
                                Quantidade de Pacotes
                            </Typography>
                            <IconButton onClick={handleCloseModal}>
                                <Close />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        {selectedCredit && (
                            <Box sx={{ mt: 3 }}>
                                <Box sx={{ mb: 4, textAlign: 'center' }}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        {credits.find(c => c.id === selectedCredit)?.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {credits.find(c => c.id === selectedCredit)?.description || 
                                        'Pacote de créditos para uso no chatbot'}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
                                    <IconButton 
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        size="large"
                                        sx={{ 
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 1
                                        }}
                                    >
                                        <Remove />
                                    </IconButton>
                                    
                                    <TextField
                                        value={quantity}
                                        onChange={(e) => handleQuantityChange(Number(e.target.value))}
                                        type="number"
                                        inputProps={{ 
                                            min: 1, 
                                            max: 100,
                                            style: { textAlign: 'center' }
                                        }}
                                        sx={{ 
                                            mx: 2,
                                            width: 100,
                                            '& .MuiOutlinedInput-root': {
                                                textAlign: 'center'
                                            }
                                        }}
                                    />
                                    
                                    <IconButton 
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        size="large"
                                        sx={{ 
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 1
                                        }}
                                    >
                                        <Add />
                                    </IconButton>
                                </Box>

                                <Box sx={{ 
                                    backgroundColor: 'action.hover',
                                    p: 3,
                                    borderRadius: 2,
                                    textAlign: 'center'
                                }}>
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        Total: {formatCurrency(
                                            (credits.find(c => c.id === selectedCredit)?.price || 0) * quantity
                                        )}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {quantity} x {formatCurrency(credits.find(c => c.id === selectedCredit)?.price || 0)}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button 
                            onClick={handleCloseModal}
                            variant="outlined"
                            sx={{ mr: 2 }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleContinueToPayment}
                            variant="contained"
                            disabled={processingPayment}
                            sx={{ minWidth: 120 }}
                        >
                            {processingPayment ? (
                                <CircularProgress size={24} />
                            ) : (
                                'Confirmar Pagamento'
                            )}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Layout>
    );
};

export default CreditPage;