// components/PaymentPage/PaymentPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Stack,
  Divider,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Layout from '../../../components/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { PaymentMethod, PaymentQRCodeResponse, PaymentResponse, PaymentStatus } from '../../../types/payment';
import { CheckCircle, Pix, ContentCopy } from '@mui/icons-material';
import QRCode from 'react-qr-code';
import { initMercadoPago } from '@mercadopago/sdk-react';
import LoadingPage from '../../../components/Loading/LoadingPage';
import { useSnackbar } from 'notistack';
import { useCompany } from '../../../contexts/CompanyContext';
import { checkPaymentStatusByCodeApi, getPaymentByIdApi } from '../../../services/api/payment';
import { generateQrCodeApi } from '../../../services/api/payment_pix';

const PaymentPage: React.FC = () => {
  const { paymentId } = useParams();
  const { getToken, state } = useAuth();
  const { companyData: globalCompany } = useCompany();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  
  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [generatingQr, setGeneratingQr] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [pixData, setPixData] = useState<PaymentQRCodeResponse | null>(null);

  const company = globalCompany || state.data?.company;

  const mpPublicKey = import.meta.env.VITE_API_ENV === "production"
    ? import.meta.env.VITE_API_MERCADO_PAGO_PUBLIC_KEY_PROD
    : import.meta.env.VITE_API_MERCADO_PAGO_PUBLIC_KEY_TEST;

  useEffect(() => {
    initMercadoPago(mpPublicKey);
  }, [mpPublicKey]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = getToken();
        
        if (!token || !paymentId || !company?.id) {
          throw new Error('Dados incompletos para carregar o pagamento');
        }

        // Busca o pagamento pelo ID
        const paymentData = await getPaymentByIdApi(token, Number(paymentId));
        setPayment(paymentData);

      } catch (err) {
        console.error('Erro ao carregar pagamento:', err);
        setError(err instanceof Error ? err.message : 'Erro ao processar pagamento');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getToken, paymentId, company?.id]);

  const generateQrCode = async () => {
    try {
      setGeneratingQr(true);
      const token = getToken();
      if (!token || !payment) {
        throw new Error('Não autorizado ou pagamento não carregado');
      }

      const qrResponse = await generateQrCodeApi(token, {
        payment_id: payment.id,
        amount: payment.amount,
        company_id: company?.id || 0,
        qr_code: payment.qr_code,
        qr_code_base64: payment.qr_code_base64,
        payment_method: PaymentMethod.PIX,
      });

      setQrCodeData(qrResponse.qr_code);
      setPixData(qrResponse);
      setQrGenerated(true);
      enqueueSnackbar('QR Code gerado com sucesso!', { variant: 'success' });
    } catch (err) {
      console.error('Erro ao gerar QR Code:', err);
      enqueueSnackbar('Erro ao gerar QR Code', { variant: 'error' });
    } finally {
      setGeneratingQr(false);
    }
  };

  const copyPixCode = () => {
    if (qrCodeData) {
      navigator.clipboard.writeText(qrCodeData);
      enqueueSnackbar('Código PIX copiado!', { variant: 'success' });
    }
  };

  // WebSocket para monitorar pagamento
  useEffect(() => {
    if (!payment?.transaction_code && pixData?.transaction_code) {
      setPayment(prev => prev ? { ...prev, transaction_code: pixData.transaction_code } : null);
      return;
    }

    if (!payment?.transaction_code) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = import.meta.env.VITE_API_BASE_URL_WS;
    const socket = new WebSocket(`${protocol}//${host}/ws/payment/${payment.transaction_code}`);

    socket.onopen = () => console.log("Conectado ao WebSocket de pagamentos");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status === PaymentStatus.PAID) {
        setSuccess(true);
        enqueueSnackbar(`Pagamento confirmado com sucesso!`, { variant: 'success' });
      }
    };

    socket.onerror = (err) => {
      console.error("Erro no WebSocket de pagamentos", err);
    };

    return () => {
      socket.close();
    };
  }, [payment?.transaction_code]);

  useEffect(() => {
    if (!payment?.transaction_code || success) return;

    const token = getToken();
    let interval: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        
        if(token){
          const response = await checkPaymentStatusByCodeApi(token, payment.transaction_code!);
          if (response.status === PaymentStatus.PAID) {
            setSuccess(true);
            enqueueSnackbar(`Pagamento confirmado automaticamente!`, { variant: 'success' });
          }
        }
      } catch (err) {
        console.error('Erro ao checar status do pagamento via REST:', err);
      }
    };

    interval = setInterval(checkStatus, 7000); // Checa a cada 7 segundos

    return () => {
      clearInterval(interval);
    };
  }, [payment?.transaction_code, success]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/painel/financeiro'); // ou qualquer rota de destino
      }, 5000); // 5 segundos

      return () => clearTimeout(timer); // limpa caso o componente seja desmontado
    }
  }, [success, navigate]);

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 12, display: 'flex', justifyContent: 'center' }}>
          <LoadingPage />
        </Container>
      </Layout>
    );
  }

  if (!payment) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 12 }}>
          <Alert severity="error">
            {error || 'Pagamento não encontrado'}
          </Alert>
        </Container>
      </Layout>
    );
  }

  const isCredit = !payment.credit_id;
  const isOverdue = payment.status === PaymentStatus.OVERDUE;
  const isPending = payment.valid_until_with_grace && new Date(payment.valid_until_with_grace) < new Date();

  return (
    <Layout withSidebar={true}>
      <>
        <Box>
          <Typography variant="h5" sx={{ mt: 8, mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
            {success ? 'Pagamento Confirmado!' : isCredit ? 'Assinatura de Plano' : 'Pagamento de Créditos'}
          </Typography>

          {success ? (
            <Box textAlign="center" sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
              <CheckCircle sx={{ fontSize: 80, color: theme.palette.success.main, mb: 3 }} />
              <Typography variant="h5" gutterBottom>
                {isCredit ? 'Pagamento atrasado regularizado com sucesso!' : 'Créditos adquiridos com sucesso!'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 4 }}>
                Você será redirecionado para a página de finanças em instantes...
              </Typography>
              <CircularProgress size={40} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', gap: 4 }}>
              
              {/* Coluna da esquerda - Pagamento via PIX */}
              <Box sx={{ flex: 1 }}>
                <Card sx={{ borderRadius: 2, boxShadow: 3, mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      <Pix sx={{ mr: 1, color: theme.palette.primary.main }} />
                      Pagamento via PIX
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={2} sx={{ mb: 3 }}>
                      <Typography variant="body1">
                        Pague usando PIX copia e cola ou escaneando o QR Code
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {isCredit 
                          ? 'O pagamento será confirmado automaticamente após a compensação' 
                          : 'Os créditos serão creditados automaticamente após a compensação'}
                      </Typography>
                      {isOverdue && (
                        <Alert severity="warning">
                          Este é um pagamento atrasado. Regularize para evitar suspensão de serviços.
                        </Alert>
                      )}
                    </Stack>

                    {!qrGenerated ? (
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={generateQrCode}
                        disabled={generatingQr}
                        sx={{ py: 2, fontWeight: 'bold' }}
                      >
                        {generatingQr ? (
                          <>
                            <CircularProgress size={24} sx={{ mr: 1 }} />
                            Gerando QR Code...
                          </>
                        ) : (
                          'Gerar QR Code para Pagamento'
                        )}
                      </Button>
                    ) : (
                      <>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'center',
                          my: 3,
                          p: 3,
                          backgroundColor: 'white',
                          borderRadius: 2,
                          border: `1px solid ${theme.palette.divider}`
                        }}>
                          <QRCode 
                            value={qrCodeData}
                            size={isSmallScreen ? 180 : 220}
                            level="H"
                          />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Código PIX (copia e cola)
                          </Typography>
                          <Box sx={{ 
                            p: 2,
                            backgroundColor: theme.palette.grey[100],
                            borderRadius: 1,
                            wordBreak: 'break-all',
                            position: 'relative'
                          }}>
                            <Typography variant="body2" fontFamily="monospace">
                              {qrCodeData}
                            </Typography>
                            <Button
                              size="small"
                              startIcon={<ContentCopy />}
                              onClick={copyPixCode}
                              sx={{ 
                                position: 'absolute', 
                                top: 4, 
                                right: 4,
                                minWidth: 'unset'
                              }}
                            />
                          </Box>
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Box>

              {/* Coluna da direita - Resumo da compra */}
              <Box sx={{ flex: 1 }}>
                <Card sx={{ borderRadius: 2, boxShadow: 3, mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {isCredit ? 'Resumo do Pagamento' : 'Resumo da Compra'}
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={2} sx={{ mb: 2 }}>
                      {isCredit ? 
                      <Box display="flex" justifyContent="space-between">
                          <Typography>Plano:</Typography>
                          <Typography fontWeight="bold">
                            {payment.name}
                          </Typography>
                        </Box>
                      : 
                      <Box display="flex" justifyContent="space-between">
                          <Typography>Pacote de Créditos:</Typography>
                          <Typography fontWeight="bold">
                            {payment.name}
                          </Typography>
                        </Box>
                      }
                      
                      <Box display="flex" justifyContent="space-between">
                        <Typography>Quantidade:</Typography>
                        <Typography>
                          {payment.quantity}x {isCredit ? 'plano' : 'créditos'}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" justifyContent="space-between">
                        <Typography>Valor:</Typography>
                        <Typography fontWeight="bold" color="primary" variant="h6">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(payment.amount)}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" justifyContent="space-between">
                        <Typography>Data:</Typography>
                        <Typography>
                          {new Date(payment.created_at).toLocaleDateString('pt-BR')}
                        </Typography>
                      </Box>

                      {isCredit && (
                        <>
                          <Box display="flex" justifyContent="space-between">
                            <Typography>Data do Vencimento:</Typography>
                            <Typography>
                              {payment.valid_until 
                                ? new Date(payment.valid_until).toLocaleDateString('pt-BR') 
                                : 'Data não disponível'}
                            </Typography>
                          </Box>
                          
                          <Box display="flex" justifyContent="space-between">
                            <Typography>Status:</Typography>
                            <Typography color={isOverdue || isPending ? "error" : "textPrimary"} fontWeight="bold">
                              {isOverdue || isPending ? 'Atrasado' : 'Pendente'}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ 
                      backgroundColor: isOverdue ? theme.palette.warning.light : theme.palette.grey[50],
                      p: 2,
                      borderRadius: 1,
                      mb: 2
                    }}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircle sx={{ color: theme.palette.success.main, mr: 1, fontSize: 20 }} />
                        {isOverdue 
                          ? 'Atenção: Este pagamento está atrasado. A regularização é necessária para manter o acesso aos serviços.'
                          : 'Compra segura via PIX com confirmação instantânea'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </>
    </Layout>
  );
};

export default PaymentPage;