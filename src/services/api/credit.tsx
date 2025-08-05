import { AxiosResponse } from 'axios';
import { api } from '.';
import { Credit, CreditCreate, CreditUpdate } from '../../types/credit';


// ✅ Listar todos os créditos
export const getCreditsApi = async (): Promise<Credit[]> => {
  try {
    const response: AxiosResponse<Credit[]> = await api.get('/credits');
    return response.data;
  } catch (error) {
    console.error('Erro ao obter créditos:', error);
    throw error;
  }
};

// ✅ Buscar crédito por ID
export const getCreditByIdApi = async (
  token: string,
  creditId: number
): Promise<Credit> => {
  try {
    const response: AxiosResponse<Credit> = await api.get(`/credits/${creditId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter crédito por ID:', error);
    throw error;
  }
};

// ✅ Criar um novo crédito
export const createCreditApi = async (
  token: string,
  data: CreditCreate
): Promise<Credit> => {
  try {
    const response: AxiosResponse<Credit> = await api.post('/credits', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar crédito:', error);
    throw error;
  }
};

// ✅ Atualizar crédito
export const updateCreditApi = async (
  token: string,
  creditId: number,
  data: CreditUpdate
): Promise<Credit> => {
  try {
    const response: AxiosResponse<Credit> = await api.put(`/credits/${creditId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar crédito:', error);
    throw error;
  }
};

// ✅ Deletar crédito
export const deleteCreditApi = async (
  token: string,
  creditId: number
): Promise<{ message: string }> => {
  try {
    const response: AxiosResponse<{ message: string }> = await api.delete(
      `/credits/${creditId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar crédito:', error);
    throw error;
  }
};
