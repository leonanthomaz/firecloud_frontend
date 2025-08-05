import { AxiosResponse } from 'axios';
import { api } from '.';
import { ProductType } from '../../types/product';

// PRODUTOS
export const getProdutos = async (token: string): Promise<ProductType[]> => {
    try {
        const response: AxiosResponse<ProductType[]> = await api.get('/products', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao obter produtos:', error);
        throw error;
    }
};

export const produtoPostApi = async (token: string, produtoData: ProductType) => {
    try {
        const response: AxiosResponse<ProductType> = await api.post('/products', produtoData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
        throw error;
    }
};

export const updateProdutoApi = async (token: string, produtoId: number, produtoData: ProductType): Promise<ProductType> => {
    try {
        const response: AxiosResponse<ProductType> = await api.put(`/products/${produtoId}`, produtoData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        throw error;
    }
};

export const deleteProdutoApi = async (token: string, produtoId: number): Promise<void> => {
    try {
        await api.delete(`/products/${produtoId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        throw error;
    }
};

export const getProdutoByIdApi = async (token: string, produtoId: number): Promise<ProductType> => {
    try {
        const response: AxiosResponse<ProductType> = await api.get(`/products/${produtoId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao obter produto por ID:', error);
        throw error;
    }
}