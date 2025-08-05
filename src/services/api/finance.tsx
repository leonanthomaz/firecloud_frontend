import { AxiosResponse } from 'axios';
import { api } from '.';
import { FinanceInfo } from '../../types/finance';

export const getFinancesApi = async (token: string): Promise<FinanceInfo[]> => {
  const response: AxiosResponse<FinanceInfo[]> = await api.get('/finances', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getFinanceByIdApi = async (token: string, id: number): Promise<FinanceInfo> => {
  const response: AxiosResponse<FinanceInfo> = await api.get(`/finances/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createFinanceApi = async (token: string, data: FinanceInfo): Promise<FinanceInfo> => {
  const response: AxiosResponse<FinanceInfo> = await api.post('/finances', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateFinanceApi = async (token: string, id: number, data: Partial<FinanceInfo>): Promise<FinanceInfo> => {
  const response: AxiosResponse<FinanceInfo> = await api.put(`/finances/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteFinanceApi = async (token: string, id: number): Promise<{ message: string }> => {
  const response: AxiosResponse<{ message: string }> = await api.delete(`/finances/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
