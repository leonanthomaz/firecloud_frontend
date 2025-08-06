import { AxiosResponse } from 'axios';
import { api } from '.';
import { PaymentPixProcess, PaymentQRCodeResponse, PaymentRequest, PaymentResponse, PaymentUpdate } from '../../types/payment';

/**
 * Lista todos os pagamentos de planos
 */
export const listPlanPaymentsApi = async (token: string): Promise<PaymentResponse[]> => {
    try {
        const response: AxiosResponse<PaymentResponse[]> = await api.get('/payments/plan/', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao listar pagamentos de planos:', error);
        throw error;
    }
};

/**
 * Busca um pagamento de plano específico pelo ID
 */
export const getPlanPaymentByIdApi = async (token: string, paymentId: number): Promise<PaymentResponse> => {
    try {
        const response: AxiosResponse<PaymentResponse> = await api.get(`/payments/plan/${paymentId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar pagamento de plano pelo ID ${paymentId}:`, error);
        throw error;
    }
};

/**
 * Cria um novo pagamento de plano
 */
export const createPlanPaymentApi = async (token: string, paymentData: PaymentRequest): Promise<PaymentResponse> => {
    try {
        const response: AxiosResponse<PaymentResponse> = await api.post('/payments/plan/', paymentData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar pagamento de plano:', error);
        throw error;
    }
};

/**
 * Atualiza um pagamento de plano existente
 */
export const updatePlanPaymentApi = async (token: string, paymentId: number, paymentData: PaymentUpdate): Promise<PaymentResponse> => {
    try {
        const response: AxiosResponse<PaymentResponse> = await api.put(`/payments/plan/${paymentId}`, paymentData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar pagamento de plano ${paymentId}:`, error);
        throw error;
    }
};

/**
 * Lista pagamentos de planos por empresa
 */
export const getPlanPaymentsByCompanyApi = async (token: string, companyId: number): Promise<PaymentResponse[]> => {
    try {
        const response: AxiosResponse<PaymentResponse[]> = await api.get(`/payments/plan/company/${companyId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar pagamentos de planos da empresa ${companyId}:`, error);
        throw error;
    }
};

/**
 * Processa pagamentos de planos pendentes (atualiza status)
 */
export const processPlanPaymentsApi = async (token: string): Promise<{ message: string }> => {
    try {
        const response: AxiosResponse<{ message: string }> = await api.post('/payments/plan/process', {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao processar pagamentos de planos:', error);
        throw error;
    }
};

/**
 * Verifica o status de um pagamento de plano específico
 */
export const checkPlanPaymentStatusApi = async (token: string, paymentId: number): Promise<{
    status: string;
    valid_until: string;
    is_active: boolean;
}> => {
    try {
        const response: AxiosResponse<{
            status: string;
            valid_until: string;
            is_active: boolean;
        }> = await api.get(`/payments/plan/${paymentId}/status`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Erro ao verificar status do pagamento de plano ${paymentId}:`, error);
        throw error;
    }
};

/**
 * Verifica se a empresa possui pagamentos de planos pendentes
 */
export const checkCompanyPendingPlanPaymentApi = async (token: string, company_id: number): Promise<{
    has_pending: boolean;
    reason: string;
}> => {
    try {
        const response: AxiosResponse<{
            has_pending: boolean;
            reason: string;
        }> = await api.get(`/payments/plan/company/has-pending/${company_id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao verificar pendências de planos da empresa:', error);
        throw error;
    }
};

/**
 * Gera QR Code PIX para pagamento de plano
 */
export const generatePlanQrCodeApi = async (
    token: string,
    paymentData: PaymentPixProcess
): Promise<PaymentQRCodeResponse> => {
    try {
        const response: AxiosResponse<PaymentQRCodeResponse> = await api.post(
            '/payments/plan/pix-qrcode',
            paymentData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Erro ao gerar QR Code de pagamento de plano:', error);
        throw error;
    }
};