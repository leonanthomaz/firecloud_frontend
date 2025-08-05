import { AxiosResponse } from 'axios';
import { api } from '.';
import { CategoryType, CategoryUpdate } from '../../types/category_product';

// CATEGORIAS DE PRODUTOS
export const getProductCategories = async (token: string, companyId: number): Promise<CategoryType[]> => {
    try {
        const response: AxiosResponse<CategoryType[]> = await api.get(`/companies/${companyId}/categories/products`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao obter categorias de produtos:', error);
        throw error;
    }
};

export const createProductCategory = async (token: string, companyId: number, categoryData: { name: string }): Promise<CategoryType> => {
    try {
        const response: AxiosResponse<CategoryType> = await api.post(`/companies/${companyId}/categories/products`, {
            name: categoryData.name,
            company_id: companyId,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar categoria de produto:', error);
        throw error;
    }
};

export const updateProductCategory = async (token: string | undefined, companyId: number, id: number, categoryData: CategoryUpdate): Promise<CategoryType> => {
    try {
        const response: AxiosResponse<CategoryType> = await api.put(`/companies/${companyId}/categories/products/${id}`, categoryData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.error('Erro ao atualizar categoria de produto:', error.response.data);
            throw new Error(error.response.data.detail || 'Erro ao atualizar categoria de produto.');
        } else if (error.request) {
            console.error('Erro de rede ao atualizar categoria de produto:', error.request);
            throw new Error('Erro de rede ao atualizar categoria de produto.');
        } else {
            console.error('Erro ao atualizar categoria de produto:', error.message);
            throw new Error('Erro ao atualizar categoria de produto.');
        }
    }
};

export const deleteProductCategory = async (token: string, companyId: number, categoryId: number): Promise<any> => {
    try {
        const response: AxiosResponse<any> = await api.delete(`/companies/${companyId}/categories/products/${categoryId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao excluir categoria de produto:', error);
        throw error;
    }
};