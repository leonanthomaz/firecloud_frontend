import { AxiosResponse } from 'axios';
import { api } from '.';
import { FinanceCategoryInfo } from '../../types/financeCategory';

export const getCategoriesApi = async (token: string): Promise<FinanceCategoryInfo[]> => {
  const response: AxiosResponse<FinanceCategoryInfo[]> = await api.get('/finance-categories', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getCategoryByIdApi = async (token: string, id: number): Promise<FinanceCategoryInfo> => {
  const response: AxiosResponse<FinanceCategoryInfo> = await api.get(`/finance-categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createCategoryApi = async (token: string, data: FinanceCategoryInfo): Promise<FinanceCategoryInfo> => {
  const response: AxiosResponse<FinanceCategoryInfo> = await api.post('/finance-categories', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateCategoryApi = async (
  token: string,
  id: number,
  data: Partial<FinanceCategoryInfo>
): Promise<FinanceCategoryInfo> => {
  const response: AxiosResponse<FinanceCategoryInfo> = await api.put(`/finance-categories/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteCategoryApi = async (token: string, id: number): Promise<{ message: string }> => {
  const response: AxiosResponse<{ message: string }> = await api.delete(`/finance-categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
