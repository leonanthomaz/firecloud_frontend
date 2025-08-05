import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Snackbar,
    Alert,
    Chip,
    CircularProgress,
    useMediaQuery,
    Theme
} from '@mui/material';
import {
    Download,
    Payment as PaymentIcon,
    CheckCircle,
    Error as ErrorIcon,
    HourglassEmpty,
    Add,
    Cancel
} from '@mui/icons-material';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../contexts/AuthContext';
import { PaymentResponse, PaymentStatus } from '../../../types/payment';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCompany } from '../../../contexts/CompanyContext';
import { Credit } from '../../../types/credit';
import { getCreditByIdApi } from '../../../services/api/credit';
import { usePayment } from '../../../contexts/PaymentContext';
import { checkPaymentStatusByCodeApi } from '../../../services/api/payment';
import { useSnackbar } from 'notistack';

const FinanceCreditPage: React.FC = () => {
    const { getToken, state } = useAuth();
    const { companyData: globalCompany } = useCompany();
    const { getPaymentsByCompany } = usePayment();
    const [payments, setPayments] = useState<PaymentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCredit, setSelectedCredit] = useState<Credit | null>(null);
    const [triedRecoveringCredit, setTriedRecoveringCredit] = useState(false);
    const [pendingCreditPayment, setPendingCreditPayment] = useState<PaymentResponse | null>(null);
    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate();

    const token = getToken();
    const company = globalCompany || state.data?.company;
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const hasPendingCreditSelected = !!selectedCredit;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const companyId = state.data?.company?.id;
                if (!token || !companyId) {
                    setError('Dados de autenticação ausentes. Por favor, faça login novamente.');
                    setLoading(false);
                    return;
                }

                const paymentsData = await getPaymentsByCompany(token, companyId);
                setPayments(paymentsData);

                const pendingCreditPayment = paymentsData.find(p =>
                    p.status === PaymentStatus.PENDING &&
                    !!p.credit_id
                );

                if (pendingCreditPayment?.credit_id) {
                    setPendingCreditPayment(pendingCreditPayment);

                    const creditData = await getCreditByIdApi(token, Number(pendingCreditPayment.credit_id));
                    setSelectedCredit(creditData);

                    localStorage.setItem('lastCreditPayment', JSON.stringify({
                        credit_id: pendingCreditPayment.credit_id,
                        payment_id: pendingCreditPayment.id
                    }));
                }


            } catch (err) {
                console.error('Erro ao buscar dados:', err);
                setError(err instanceof Error ? err.message : 'Erro ao buscar dados financeiros.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, company?.id]);

    useEffect(() => {
        const recoverCreditFromCache = async () => {
            if (!triedRecoveringCredit) {
                setTriedRecoveringCredit(true);

                if (!token) {
                    setError('Dados de autenticação ausentes. Por favor, faça login novamente.');
                    setLoading(false);
                    return;
                }

                const cachedCreditPayment = localStorage.getItem('lastCreditPayment');
                if (cachedCreditPayment) {
                    try {
                        const parsedPayment = JSON.parse(cachedCreditPayment);
                        if (parsedPayment?.credit_id) {
                            const creditData = await getCreditByIdApi(token, Number(parsedPayment?.credit_id));
                            const currentPayment = payments.find(p => p.id === parsedPayment.payment_id);

                            if (currentPayment?.status === PaymentStatus.PENDING) {
                                setSelectedCredit(creditData);
                            } else {
                                localStorage.removeItem('lastCreditPayment');
                                setSelectedCredit(null);
                            }
                        }
                    } catch (e) {
                        console.error('Erro ao analisar o pagamento de crédito em cache:', e);
                        localStorage.removeItem('lastCreditPayment');
                    }
                }
            }
        };

        recoverCreditFromCache();
    }, [triedRecoveringCredit, token]);
    
    const handleDownloadRelatorio = useCallback(() => {
        alert('Funcionalidade de baixar relatório ainda não implementada.');
    }, []);

    const handleComprarCreditos = useCallback(() => {
        navigate('/painel/credito');
    }, [navigate]);

    const handleCancelarCreditoSelecionado = useCallback(() => {
        localStorage.removeItem('lastCreditPayment');
        setSelectedCredit(null);
        setTriedRecoveringCredit(false);
    }, []);

    const handleIrParaPagamentoPendente = useCallback(() => {
        if (pendingCreditPayment) {
            navigate(`/painel/pagamentos/${pendingCreditPayment.id}`);
        }
    }, [pendingCreditPayment, navigate]);

    // Todas as transações de crédito ordenadas pela data mais recente
    const creditTransactions = useMemo(() => {
        return payments
            .filter(p => p.credit_id)
            .sort((a, b) =>
                new Date(b.created_at || b.created_at).getTime() - new Date(a.created_at || a.created_at).getTime()
            );
    }, [payments]);

    const formatDate = useCallback((dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            const date = parseISO(dateString);
            if (isSmallScreen) {
                return format(date, 'dd/MM', { locale: ptBR });
            }
            return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
        } catch (e) {
            console.error('Erro ao formatar data:', dateString, e);
            return dateString;
        }
    }, [isSmallScreen]);

    const formatCurrency = useCallback((value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: isSmallScreen ? 0 : 2,
            maximumFractionDigits: isSmallScreen ? 0 : 2
        }).format(value);
    }, [isSmallScreen]);

    const getStatusChip = useCallback((status: PaymentStatus) => {
        let label = '';
        let color: 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary' | undefined = undefined;
        let icon: React.ReactElement | null = null;
        const iconSize = isSmallScreen ? 'small' : 'medium';

        switch (status) {
            case PaymentStatus.PAID:
                label = 'Pago';
                color = 'success';
                icon = <CheckCircle fontSize={iconSize} />;
                break;
            case PaymentStatus.PENDING:
                label = 'Pendente';
                color = 'warning';
                icon = <HourglassEmpty fontSize={iconSize} />;
                break;
            case PaymentStatus.FAILED:
                label = 'Falhou';
                color = 'error';
                icon = <ErrorIcon fontSize={iconSize} />;
                break;
            default:
                label = status;
                break;
        }

        return (
            <Chip
                label={label}
                size="small"
                color={color}
                icon={icon || undefined}
                sx={{ ml: isSmallScreen ? 0 : 1 }}
            />
        );
    }, [isSmallScreen]);

    const handleCloseSnackbar = useCallback(() => {
        setError(null);
    }, []);

    // Adicione este useEffect para monitorar pagamentos pendentes
    useEffect(() => {
        if (!pendingCreditPayment?.transaction_code) return;

        const token = getToken();
        let interval: NodeJS.Timeout;

        const checkStatus = async () => {
            try {
                if (token) {
                    const response = await checkPaymentStatusByCodeApi(
                        token, 
                        pendingCreditPayment.transaction_code!
                    );
                    
                    if (response.status === PaymentStatus.PAID) {
                        // Atualiza a lista de pagamentos
                        const updatedPayments = await getPaymentsByCompany(token, company?.id || 0);
                        setPayments(updatedPayments);
                        
                        // Remove o crédito selecionado
                        setSelectedCredit(null);
                        setPendingCreditPayment(null);
                        localStorage.removeItem('lastCreditPayment');
                        
                        enqueueSnackbar('Pagamento confirmado!', { variant: 'success' });
                    }
                }
            } catch (err) {
                console.error('Erro ao verificar status do pagamento:', err);
            }
        };

        // Verifica a cada 30 segundos (menos frequente que na página de pagamento)
        interval = setInterval(checkStatus, 30000);

        return () => {
            clearInterval(interval);
        };
    }, [pendingCreditPayment?.transaction_code, token, company?.id]);

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
                <Typography variant="h4" fontWeight="bold" sx={{ mt: 8, mb: 1, color: 'primary.main', fontWeight: 'bold' }}>
                    Financeiro - Créditos
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, fontSize: isSmallScreen ? '0.875rem' : '1rem' }}>
                    Gerencie seus créditos e pagamentos relacionados.
                </Typography>

                {/* Status Financeiro Atual */}
                <Card sx={{ mb: 1, backgroundColor: hasPendingCreditSelected ? '#ffebee' : '#e8f5e9' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant={isSmallScreen ? "subtitle2" : "h6"} gutterBottom>
                                Status Financeiro Atual
                            </Typography>
                            <Typography variant={isSmallScreen ? "caption" : "body2"}>
                                {hasPendingCreditSelected
                                    ? `Você tem ${selectedCredit?.name} aguardando pagamento (${formatCurrency(selectedCredit?.price || 0)})`
                                    : 'Nenhum crédito pendente de pagamento.'}
                            </Typography>
                        </Box>
                        {hasPendingCreditSelected ? (
                            <HourglassEmpty sx={{ color: 'warning.main', fontSize: isSmallScreen ? 30 : 40 }} />
                        ) : (
                            <CheckCircle sx={{ color: 'success.main', fontSize: isSmallScreen ? 30 : 40 }} />
                        )}
                    </CardContent>
                </Card>

                {/* Ação Principal */}
                <Card sx={{ mb: 1 }}>
                    <CardContent>
                        <Typography variant={isSmallScreen ? "subtitle2" : "h6"} gutterBottom>
                            Ação Principal
                        </Typography>

                        {hasPendingCreditSelected ? (
                            <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1, mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography fontWeight="bold">{selectedCredit?.name || 'Crédito'}</Typography>
                                    <Typography>{formatCurrency(selectedCredit?.price || 0)}</Typography>
                                </Box>
                                <Box display="flex" gap={1} flexDirection={isSmallScreen ? 'column' : 'row'}>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<Cancel />}
                                        onClick={handleCancelarCreditoSelecionado}
                                        size={isSmallScreen ? "small" : "medium"}
                                        fullWidth={isSmallScreen}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<PaymentIcon />}
                                        onClick={handleIrParaPagamentoPendente}
                                        size={isSmallScreen ? "small" : "medium"}
                                        fullWidth={isSmallScreen}
                                    >
                                        Finalizar Pagamento
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                <Typography sx={{ mb: 2 }}>
                                    {creditTransactions.filter(t => t.status === PaymentStatus.PAID).length === 0
                                        ? 'Adicione créditos para utilizar nossos serviços.'
                                        : 'Nenhum crédito esperando pagamento.'}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Add />}
                                    onClick={handleComprarCreditos}
                                    size={isSmallScreen ? "small" : "medium"}
                                >
                                    Comprar Créditos
                                </Button>
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {/* Histórico de Transações */}
                <Card>
                    <CardContent>
                        <Typography variant={isSmallScreen ? "subtitle2" : "h6"} gutterBottom>
                            Histórico de Créditos
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table size={isSmallScreen ? "small" : "medium"}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Data</TableCell>
                                        {!isSmallScreen && <TableCell sx={{ fontWeight: 'bold' }}>Descrição</TableCell>}
                                        <TableCell sx={{ fontWeight: 'bold' }}>Valor</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Pagar</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {creditTransactions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={isSmallScreen ? 4 : 5} align="center">
                                                Nenhuma transação de crédito encontrada.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        creditTransactions.map((transaction) => (
                                            <TableRow key={transaction.id}>
                                                <TableCell>{formatDate(transaction.created_at)}</TableCell>
                                                {!isSmallScreen && (
                                                    <TableCell>
                                                        {selectedCredit?.name || 'Crédito'}
                                                        {transaction.invoice_id && (
                                                            <Typography variant="caption" color="textSecondary" display="block">
                                                                NF: {transaction.invoice_id}
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                )}
                                                <TableCell sx={{ fontWeight: 'bold' }}>
                                                    {formatCurrency(transaction.amount)}
                                                </TableCell>
                                                <TableCell>
                                                    {transaction.status === PaymentStatus.PENDING && transaction.credit_id && (
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<PaymentIcon />}
                                                            onClick={handleIrParaPagamentoPendente}
                                                        >
                                                            Pagar
                                                        </Button>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusChip(transaction.status)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>

                {/* Botão para baixar relatório */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Download />}
                        onClick={handleDownloadRelatorio}
                        size={isSmallScreen ? "small" : "medium"}
                    >
                        Exportar Extrato
                    </Button>
                </Box>

                <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            </Box>
        </Layout>
    );
};

export default FinanceCreditPage;