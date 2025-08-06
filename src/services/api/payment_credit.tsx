import { AxiosResponse } from 'axios';
import { api } from '.';
import { PaymentPixProcess, PaymentQRCodeResponse, PaymentRequest, PaymentResponse, PaymentUpdate } from '../../types/payment';

/**
 * Lista todos os pagamentos de créditos
 */
export const listCreditPaymentsApi = async (token: string): Promise<PaymentResponse[]> => {
    try {
        const response: AxiosResponse<PaymentResponse[]> = await api.get('/payments/credit/', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao listar pagamentos de créditos:', error);
        throw error;
    }
};

/**
 * Busca um pagamento de crédito específico pelo ID
 */
export const getCreditPaymentByIdApi = async (token: string, paymentId: number): Promise<PaymentResponse> => {
    try {
        const response: AxiosResponse<PaymentResponse> = await api.get(`/payments/credit/${paymentId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar pagamento de crédito pelo ID ${paymentId}:`, error);
        throw error;
    }
};

/**
 * Cria um novo pagamento de crédito
 */
export const createCreditPaymentApi = async (token: string, paymentData: PaymentRequest): Promise<PaymentResponse> => {
    try {
        const response: AxiosResponse<PaymentResponse> = await api.post('/payments-teste/', paymentData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar pagamento de crédito:', error);
        throw error;
    }
};

/**
 * Atualiza um pagamento de crédito existente
 */
export const updateCreditPaymentApi = async (token: string, paymentId: number, paymentData: PaymentUpdate): Promise<PaymentResponse> => {
    try {
        const response: AxiosResponse<PaymentResponse> = await api.put(`/payments/credit/${paymentId}`, paymentData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar pagamento de crédito ${paymentId}:`, error);
        throw error;
    }
};

/**
 * Lista pagamentos de créditos por empresa
 */
export const getCreditPaymentsByCompanyApi = async (token: string, companyId: number): Promise<PaymentResponse[]> => {
    try {
        const response: AxiosResponse<PaymentResponse[]> = await api.get(`/payments/credit/company/${companyId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar pagamentos de créditos da empresa ${companyId}:`, error);
        throw error;
    }
};

/**
 * Processa pagamentos de créditos pendentes (atualiza status)
 */
export const processCreditPaymentsApi = async (token: string): Promise<{ message: string }> => {
    try {
        const response: AxiosResponse<{ message: string }> = await api.post('/payments/credit/process', {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao processar pagamentos de créditos:', error);
        throw error;
    }
};

/**
 * Verifica o status de um pagamento de crédito específico
 */
export const checkCreditPaymentStatusApi = async (token: string, paymentId: number): Promise<{
    status: string;
    valid_until: string;
    is_active: boolean;
    token_amount?: number; // Adicionado campo específico para créditos
}> => {
    try {
        const response: AxiosResponse<{
            status: string;
            valid_until: string;
            is_active: boolean;
            token_amount?: number;
        }> = await api.get(`/payments/credit/${paymentId}/status`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Erro ao verificar status do pagamento de crédito ${paymentId}:`, error);
        throw error;
    }
};

/**
 * Verifica se a empresa possui pagamentos de créditos pendentes
 */
export const checkCompanyPendingCreditPaymentApi = async (token: string, company_id: number): Promise<{
    has_pending: boolean;
    reason: string;
}> => {
    try {
        const response: AxiosResponse<{
            has_pending: boolean;
            reason: string;
        }> = await api.get(`/payments/credit/company/has-pending/${company_id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao verificar pendências de créditos da empresa:', error);
        throw error;
    }
};

/**
 * Gera QR Code PIX para pagamento de crédito
 */
export const generateCreditQrCodeApi = async (
    token: string,
    paymentData: PaymentPixProcess
): Promise<PaymentQRCodeResponse> => {
    try {
        const response: AxiosResponse<PaymentQRCodeResponse> = await api.post(
            '/payments/credit/pix-qrcode',
            paymentData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Erro ao gerar QR Code de pagamento de crédito:', error);
        throw error;
    }
};