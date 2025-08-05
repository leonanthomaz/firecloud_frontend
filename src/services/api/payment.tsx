import { AxiosResponse } from 'axios';
import { api } from '.';
import { PaymentRequest, PaymentResponse, PaymentUpdate } from '../../types/payment';

/**
 * Lista todos os pagamentos
 */
export const listPaymentsApi = async (token: string): Promise<PaymentResponse[]> => {
    try {
        const response: AxiosResponse<PaymentResponse[]> = await api.get('/payments/', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao listar pagamentos:', error);
        throw error;
    }
};

/**
 * Busca um pagamento específico pelo ID
 */
export const getPaymentByIdApi = async (token: string, paymentId: number): Promise<PaymentResponse> => {
    try {
        const response: AxiosResponse<PaymentResponse> = await api.get(`/payments/${paymentId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar pagamento pelo ID ${paymentId}:`, error);
        throw error;
    }
};

/**
 * Cria um novo pagamento
 */
export const createPaymentApi = async (token: string, paymentData: PaymentRequest): Promise<PaymentResponse> => {
    try {
        const response: AxiosResponse<PaymentResponse> = await api.post('/payments/', paymentData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar pagamento:', error);
        throw error;
    }
};

/**
 * Atualiza um pagamento existente
 */
export const updatePaymentApi = async (token: string, paymentId: number, paymentData: PaymentUpdate): Promise<PaymentResponse> => {
    try {
        const response: AxiosResponse<PaymentResponse> = await api.put(`/payments/${paymentId}`, paymentData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar pagamento ${paymentId}:`, error);
        throw error;
    }
};

export const deletePaymentApi = async (token: string, paymentId: number): Promise<string> => {
    try {
        const response: AxiosResponse<string> = await api.delete(`/payments/${paymentId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar pagamento ${paymentId}:`, error);
        throw error;
    }
};

/**
 * Lista pagamentos por empresa
 */
export const getPaymentsByCompanyApi = async (token: string, companyId: number): Promise<PaymentResponse[]> => {
    try {
        const response: AxiosResponse<PaymentResponse[]> = await api.get(`/payments/company/${companyId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar pagamentos da empresa ${companyId}:`, error);
        throw error;
    }
};

/**
 * Processa pagamentos pendentes (atualiza status)
 */
export const processPaymentsApi = async (token: string): Promise<{ message: string }> => {
    try {
        const response: AxiosResponse<{ message: string }> = await api.post('/payments/process', {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao processar pagamentos:', error);
        throw error;
    }
};

/**
 * Verifica o status de um pagamento específico
 */
export const checkPaymentStatusApi = async (token: string, paymentId: number): Promise<{
    status: string;
    valid_until: string;
    is_active: boolean;
}> => {
    try {
        const response: AxiosResponse<{
            status: string;
            valid_until: string;
            is_active: boolean;
        }> = await api.get(`/payments/${paymentId}/status`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Erro ao verificar status do pagamento ${paymentId}:`, error);
        throw error;
    }
};

/**
 * Verifica se a empresa do usuário possui algum pagamento pendente
 */
export const checkCompanyPendingPaymentApi = async (token: string, company_id: number): Promise<{
    has_pending: boolean;
    reason: string;
}> => {
    try {
        const response: AxiosResponse<{
            has_pending: boolean;
            reason: string;
        }> = await api.get(`/payments/company/has-pending/${company_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao verificar pendências da empresa:', error);
        throw error;
    }
};


/**
 * Verifica o status do pagamento via transaction_code
 */
export const checkPaymentStatusByCodeApi = async (
    token: string,
    transactionCode: string
): Promise<{
    status: string;
    paid_at: string | null;
}> => {
    try {
        const response: AxiosResponse<{
            status: string;
            paid_at: string | null;
        }> = await api.get(`/payments/status/${transactionCode}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(`Erro ao verificar status do pagamento (code: ${transactionCode}):`, error);
        throw error;
    }
};
