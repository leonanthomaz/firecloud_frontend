import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    List,
    ListItem,
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
} from '@mui/icons-material';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../contexts/AuthContext';
import { PaymentResponse, PaymentStatus } from '../../../types/payment';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCompany } from '../../../contexts/CompanyContext';
import { PlanInfo } from '../../../types/plan';
import { getPlanByIdApi } from '../../../services/api/plan';
import { usePayment } from '../../../contexts/PaymentContext';

const FinancePlanPage: React.FC = () => {
    const { getToken, state } = useAuth();
    const { companyData: globalCompany } = useCompany();
    const { getPaymentsByCompany } = usePayment();
    const [plan, setPlan] = useState<PlanInfo | undefined>(); 
    const [payments, setPayments] = useState<PaymentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const token = getToken();
    const company = globalCompany || state.data?.company;
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

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

                if (company?.plan_id) {
                    const planResponse = await getPlanByIdApi(token, company.plan_id);
                    setPlan(planResponse);
                } else {
                    setPlan(undefined);
                }

                const paymentsData = await getPaymentsByCompany(token, companyId);
                setPayments(paymentsData);

            } catch (err) {
                console.error('Erro ao buscar dados:', err);
                setError(err instanceof Error ? err.message : 'Erro ao buscar dados financeiros.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, company?.plan_id, state.data?.company?.id]);
    
    const handleDownloadRelatorio = useCallback(() => {
        alert('Funcionalidade de baixar relatório ainda não implementada.');
    }, []);

    const handlePagarMensalidade = useCallback((paymentId: number) => {
        navigate(`/painel/pagamentos/${paymentId}`);
    }, [navigate]);

    // Pagamentos pendentes do plano mensal
    const pendingPayments = useMemo(() => {
        return payments.filter(p => p.status === PaymentStatus.PENDING && p.plan_id);
    }, [payments]);

    const hasPendingPayments = pendingPayments.length > 0;

    // Todas as transações ordenadas pela data mais recente
    const transactions = useMemo(() => {
        return [...payments].sort((a, b) =>
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
            case PaymentStatus.PREPAID:
                label = 'Pré-pago';
                color = 'info';
                break;
            case PaymentStatus.FAILED:
                label = 'Falhou';
                color = 'error';
                icon = <ErrorIcon fontSize={iconSize} />;
                break;
            case PaymentStatus.TRIAL:
                label = 'Teste';
                color = 'secondary';
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
                    Financeiro - Plano
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, fontSize: isSmallScreen ? '0.875rem' : '1rem' }}>
                    Gerencie seus pagamentos de assinatura mensal.
                </Typography>

                {/* Status Financeiro Atual */}
                <Card sx={{ mb: 1,backgroundColor: hasPendingPayments ? '#ffebee' : '#e8f5e9'}}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant={isSmallScreen ? "subtitle2" : "h6"} gutterBottom>
                                Status Financeiro Atual
                            </Typography>
                            <Typography variant={isSmallScreen ? "caption" : "body2"}>
                                {hasPendingPayments
                                    ? `${pendingPayments.length} mensalidade(s) pendente(s).`
                                    : 'Todas as mensalidades estão em dia.'}
                            </Typography>
                        </Box>
                        {hasPendingPayments ? (
                            <ErrorIcon sx={{ color: 'error.main', fontSize: isSmallScreen ? 30 : 40 }} />
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

                        {hasPendingPayments ? (
                            <List dense>
                                {pendingPayments.map((payment) => (
                                    <ListItem key={payment.id} sx={{ borderBottom: '1px solid #eee' }}>
                                        <Box sx={{ width: '100%', display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', justifyContent: 'space-between', alignItems: isSmallScreen ? 'flex-start' : 'center' }}>
                                            <Box mb={isSmallScreen ? 1 : 0}>
                                                <Typography fontWeight="bold">
                                                    {plan?.name || 'Assinatura Mensal'}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    Vencimento: {formatDate(payment.valid_until || payment.created_at)}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Typography fontWeight="bold">
                                                    {formatCurrency(payment.amount)}
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<PaymentIcon />}
                                                    onClick={() => handlePagarMensalidade(payment.id)}
                                                >
                                                    Pagar
                                                </Button>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                <Typography sx={{ mb: 2 }}>
                                    Todas as mensalidades estão em dia.
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {/* Histórico de Transações */}
                <Card>
                    <CardContent>
                        <Typography variant={isSmallScreen ? "subtitle2" : "h6"} gutterBottom>
                            Histórico de Transações
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
                                    {transactions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={isSmallScreen ? 4 : 5} align="center">
                                                Nenhuma transação encontrada.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        transactions.map((transaction) => (
                                            <TableRow key={transaction.id}>
                                                <TableCell>{formatDate(transaction.created_at)}</TableCell>
                                                {!isSmallScreen && (
                                                    <TableCell>
                                                        {plan?.name || 'Assinatura Mensal'}
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
                                                    {transaction.status === PaymentStatus.PENDING && (
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<PaymentIcon />}
                                                            onClick={() => handlePagarMensalidade(transaction.id)}
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

export default FinancePlanPage;