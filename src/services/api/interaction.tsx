
import { AxiosResponse } from 'axios';
import { api } from '.';


export const getInteractionsByCompany = async (token: string, company_id: number): Promise<any[]> => {
    try {
        const response: AxiosResponse<any[]> = await api.get(`/interactions/company/${company_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao obter interações da empresa:', error);
        throw error;
    }
};

export const getInteractionsByClientName = async (token: string, clientName: string): Promise<any[]> => {
    try {
        const response: AxiosResponse<any[]> = await api.get(`/interactions/client/${clientName}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao obter interações por nome do cliente:', error);
        throw error;
    }
};

export const getInteractionsByOutcome = async (token: string, outcome: string): Promise<any[]> => {
    try {
        const response: AxiosResponse<any[]> = await api.get(`/interactions/outcome/${outcome}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao obter interações por resultado:', error);
        throw error;
    }
};

export const getInteractionsByInterest = async (token: string, interest: string): Promise<any[]> => {
    try {
        const response: AxiosResponse<any[]> = await api.get(`/interactions/interest/${interest}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao obter interações por interesse:', error);
        throw error;
    }
};

export const getInteractionsByValueRange = async (token: string, min?: number, max?: number): Promise<any[]> => {
    try {
        const params: Record<string, number> = {};
        if (min !== undefined) params.min = min;
        if (max !== undefined) params.max = max;

        const response: AxiosResponse<any[]> = await api.get('/interactions/value', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: params,
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao obter interações por valor estimado:', error);
        throw error;
    }
};

export const getInteractionsByDateRange = async (token: string, start?: string, end?: string): Promise<any[]> => {
    try {
        const params: Record<string, string> = {};
        if (start) params.start = start;
        if (end) params.end = end;

        const response: AxiosResponse<any[]> = await api.get('/interactions/date', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: params,
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao obter interações por data de criação:', error);
        throw error;
    }
};