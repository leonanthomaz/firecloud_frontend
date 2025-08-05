import { AxiosResponse } from 'axios';
import { api } from '.';
import { CategoryType } from '../../types/category_service';

// CATEGORIAS
export const getServiceCategories = async (token: string, companyId: number): Promise<CategoryType[]> => {
    try {
        const response: AxiosResponse<CategoryType[]> = await api.get(`/companies/${companyId}/categories/services`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao obter categorias do serviço:', error);
        throw error;
    }
};

export const createServiceCategory = async (token: string, companyId: number, categoryData: { name: string }): Promise<CategoryType> => {
    try {
        const response: AxiosResponse<CategoryType> = await api.post(`/companies/${companyId}/categories/services`, {
            name: categoryData.name,
            company_id: companyId,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar categoria para o serviço:', error);
        throw error;
    }
};

export const updateServiceCategory = async (token: string, companyId: number, categoryId: number, categoryData: { name?: string, company_id?: number }): Promise<CategoryType> => {
    try {
        const response: AxiosResponse<CategoryType> = await api.put(`/companies/${companyId}/categories/services/${categoryId}`, {
            name: categoryData.name,
            company_id: categoryData.company_id,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.error('Erro ao atualizar categoria do serviço:', error.response.data);
            throw new Error(error.response.data.detail || 'Erro ao atualizar categoria.');
        } else if (error.request) {
            console.error('Erro de rede ao atualizar categoria:', error.request);
            throw new Error('Erro de rede ao atualizar categoria.');
        } else {
            console.error('Erro ao atualizar categoria do serviço:', error.message);
            throw new Error('Erro ao atualizar categoria.');
        }
    }
};

export const deleteServiceCategory = async (token: string, companyId: number, categoryId: number): Promise<any> => {
    try {
        const response: AxiosResponse<any> = await api.delete(`/companies/${companyId}/categories/services/${categoryId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao excluir categoria do serviço:', error);
        throw error;
    }
};