import { AxiosResponse } from 'axios';
import { api } from '.';
import {
  PaymentItem,
} from '../../types/payment_item';

/**
 * Lista todos os itens de pagamento
 */
export const listPaymentItemsApi = async (token: string): Promise<PaymentItem[]> => {
  try {
    const response: AxiosResponse<PaymentItem[]> = await api.get('/payment-items/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao listar itens de pagamento:', error);
    throw error;
  }
};

/**
 * Cria um novo item de pagamento
 */
export const createPaymentItemApi = async (
  token: string,
  data: PaymentItem
): Promise<PaymentItem> => {
  try {
    const response: AxiosResponse<PaymentItem> = await api.post('/payment-items/', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar item de pagamento:', error);
    throw error;
  }
};

/**
 * Busca um item de pagamento específico pelo ID
 */
export const getPaymentItemByIdApi = async (
  token: string,
  itemId: number
): Promise<PaymentItem> => {
  try {
    const response: AxiosResponse<PaymentItem> = await api.get(`/payment-items/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar item de pagamento ${itemId}:`, error);
    throw error;
  }
};

/**
 * Atualiza um item de pagamento
 */
export const updatePaymentItemApi = async (
  token: string,
  itemId: number,
  data: PaymentItem
): Promise<PaymentItem> => {
  try {
    const response: AxiosResponse<PaymentItem> = await api.put(`/payment-items/${itemId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar item de pagamento ${itemId}:`, error);
    throw error;
  }
};

/**
 * Deleta um item de pagamento
 */
export const deletePaymentItemApi = async (
  token: string,
  itemId: number
): Promise<void> => {
  try {
    await api.delete(`/payment-items/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error(`Erro ao deletar item de pagamento ${itemId}:`, error);
    throw error;
  }
};
