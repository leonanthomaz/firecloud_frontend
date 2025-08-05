import { AxiosResponse } from 'axios';
import { api } from '.'; // Assumindo que você tem o api configurado aqui
import { AssistantInfo } from '../../types/assistant';

export const getAssistantsApi = async (token: string, companyId: number): Promise<AssistantInfo[]> => {
    try {
        const response: AxiosResponse<AssistantInfo[]> = await api.get(`/assistants/${companyId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao obter assistentes:', error);
        throw error;
    }
};

export const getAssistantByCompany = async (token: string, companyId: number): Promise<AssistantInfo> => {
    try {
        const response: AxiosResponse<AssistantInfo> = await api.get(`/assistant/${companyId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao obter assistente por ID:', error);
        throw error;
    }
};

export const getAssistantByIdApi = async (token: string, companyId: number, assistantId: number): Promise<AssistantInfo> => {
    try {
        const response: AxiosResponse<AssistantInfo> = await api.get(`/assistants/${companyId}/${assistantId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao obter assistente por ID:', error);
        throw error;
    }
};

export const createAssistantApi = async (token: string, companyId: number, assistantData: Omit<AssistantInfo, 'id' | 'created_at' | 'updated_at'>): Promise<AssistantInfo> => {
    try {
        const response: AxiosResponse<AssistantInfo> = await api.post(`/assistants/${companyId}/`, assistantData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar assistente:', error);
        throw error;
    }
};

export const updateAssistantApi = async (token: string, companyId: number, assistantId: number, assistantData: Partial<Omit<AssistantInfo, 'id' | 'created_at' | 'updated_at'>>): Promise<AssistantInfo> => {
    try {
        const response: AxiosResponse<AssistantInfo> = await api.put(`/assistants/${companyId}/${assistantId}`, assistantData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar assistente:', error);
        throw error;
    }
};

export const deleteAssistantApi = async (token: string, companyId: number, assistantId: number): Promise<{ message: string }> => {
    try {
        const response: AxiosResponse<{ message: string }> = await api.delete(`/assistants/${companyId}/${assistantId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao excluir assistente:', error);
        throw error;
    }
};