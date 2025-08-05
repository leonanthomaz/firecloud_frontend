import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useSnackbar } from 'notistack';
import {
  listPaymentsApi,
  getPaymentByIdApi,
  createPaymentApi,
  updatePaymentApi,
  getPaymentsByCompanyApi,
  processPaymentsApi,
  checkPaymentStatusApi,
  checkCompanyPendingPaymentApi,
} from '../services/api/payment';

import {
  PaymentResponse,
  PaymentRequest,
  PaymentUpdate,
  PaymentPixProcess,
  PaymentQRCodeResponse
} from '../types/payment';

import { useGlobal } from './GlobalContext';
import { generateQrCodeApi } from '../services/api/payment_pix';

interface PaymentContextType {
  payments: PaymentResponse[];
  currentPayment: PaymentResponse | null;
  companyPayments: PaymentResponse[];
  pendingPaymentStatus: {
    has_pending: boolean;
    reason: string;
  } | null;
  qrCodeData: PaymentQRCodeResponse | null;
  
  // Métodos da API
  listPayments: (token: string) => Promise<void>;
  getPaymentById: (token: string, paymentId: number) => Promise<void>;
  createPayment: (token: string, paymentData: PaymentRequest) => Promise<PaymentResponse | void>;
  updatePayment: (token: string, paymentId: number, paymentData: PaymentUpdate) => Promise<void>;
  getPaymentsByCompany: (token: string, companyId: number) => Promise<PaymentResponse[]>;
  processPayments: (token: string) => Promise<void>;
  checkPaymentStatus: (token: string, paymentId: number) => Promise<void>;
  checkCompanyPendingPayment: (token: string, company_id: number) => Promise<void>;
  generateQrCode: (token: string, paymentData: PaymentPixProcess) => Promise<void>;
  
  // Métodos auxiliares
  clearCurrentPayment: () => void;
  clearPayments: () => void;
  clearCompanyPayments: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [currentPayment, setCurrentPayment] = useState<PaymentResponse | null>(null);
  const [companyPayments, setCompanyPayments] = useState<PaymentResponse[]>([]);
  const [pendingPaymentStatus, setPendingPaymentStatus] = useState<{
    has_pending: boolean;
    reason: string;
  } | null>(null);
  const [qrCodeData, setQrCodeData] = useState<PaymentQRCodeResponse | null>(null);
  const { setLoading } = useGlobal();

  // console.log("payments", payments)
  // console.log("currentPayment", currentPayment)
  // console.log("companyPayments", companyPayments)
  // console.log("pendingPaymentStatus", pendingPaymentStatus)
  
  const { enqueueSnackbar } = useSnackbar();

  // Função para tratar erros de forma consistente
  const handleError = (error: any, defaultMessage: string) => {
    console.error(defaultMessage, error);
    const message = error.response?.data?.message || defaultMessage;
    enqueueSnackbar(message, { variant: 'error' });
    throw error;
  };

  const listPayments = async (token: string) => {
    setLoading(true);
    try {
      const data = await listPaymentsApi(token);
      setPayments(data);
    } catch (error) {
      handleError(error, 'Erro ao listar pagamentos');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentById = async (token: string, paymentId: number) => {
    setLoading(true);
    try {
      const data = await getPaymentByIdApi(token, paymentId);
      setCurrentPayment(data);
    } catch (error) {
      handleError(error, `Erro ao buscar pagamento ${paymentId}`);
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (token: string, paymentData: PaymentRequest) => {
    setLoading(true);
    try {
      const data = await createPaymentApi(token, paymentData);
      enqueueSnackbar('Pagamento criado com sucesso', { variant: 'success' });
      return data;
    } catch (error) {
      handleError(error, 'Erro ao criar pagamento');
    } finally {
      setLoading(false);
    }
  };

  const updatePayment = async (token: string, paymentId: number, paymentData: PaymentUpdate) => {
    setLoading(true);
    try {
      const data = await updatePaymentApi(token, paymentId, paymentData);
      setCurrentPayment(data);
      enqueueSnackbar('Pagamento atualizado com sucesso', { variant: 'success' });
    } catch (error) {
      handleError(error, `Erro ao atualizar pagamento ${paymentId}`);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentsByCompany = async (token: string, companyId: number): Promise<PaymentResponse[]> => {
    setLoading(true);
    try {
      const data = await getPaymentsByCompanyApi(token, companyId);
      setCompanyPayments(data);
      return data;
    } catch (error) {
      handleError(error, `Erro ao buscar pagamentos da empresa ${companyId}`);
      return [];
    } finally {
      setLoading(false);
    }
  };


  const processPayments = async (token: string) => {
    setLoading(true);
    try {
      const result = await processPaymentsApi(token);
      enqueueSnackbar(result.message, { variant: 'success' });
    } catch (error) {
      handleError(error, 'Erro ao processar pagamentos');
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (token: string, paymentId: number) => {
    setLoading(true);
    try {
      const status = await checkPaymentStatusApi(token, paymentId);
      setCurrentPayment(prev => ({
        ...prev!,
        status: status.status as PaymentResponse['status'],
        valid_until: status.valid_until,
        is_active: status.is_active
      }));
    } catch (error) {
      handleError(error, `Erro ao verificar status do pagamento ${paymentId}`);
    } finally {
      setLoading(false);
    }
  };

  const checkCompanyPendingPayment = async (token: string, company_id: number) => {
    setLoading(true);
    try {
      const status = await checkCompanyPendingPaymentApi(token, company_id);
      setPendingPaymentStatus(status);
    } catch (error) {
      handleError(error, 'Erro ao verificar pendências da empresa');
    } finally {
      setLoading(false);
    }
  };

  const generateQrCode = async (token: string, paymentData: PaymentPixProcess) => {
    setLoading(true);
    try {
      const data = await generateQrCodeApi(token, paymentData);
      setQrCodeData(data);
    } catch (error) {
      handleError(error, 'Erro ao gerar QR Code de pagamento');
    } finally {
      setLoading(false);
    }
  };

  const clearCurrentPayment = () => {
    setCurrentPayment(null);
  };

  const clearPayments = () => {
    setPayments([]);
  };

  const clearCompanyPayments = () => {
    setCompanyPayments([]);
  };

  return (
    <PaymentContext.Provider
      value={{
        payments,
        currentPayment,
        companyPayments,
        pendingPaymentStatus,
        qrCodeData,
        listPayments,
        getPaymentById,
        createPayment,
        updatePayment,
        getPaymentsByCompany,
        processPayments,
        checkPaymentStatus,
        checkCompanyPendingPayment,
        generateQrCode,
        clearCurrentPayment,
        clearPayments,
        clearCompanyPayments
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};