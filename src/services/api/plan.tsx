import { AxiosResponse } from 'axios';
import { api } from '.';
import { PlanInfo } from '../../types/plan';

export const getPlansApi = async (): Promise<PlanInfo[]> => {
    try {
        const response: AxiosResponse<PlanInfo[]> = await api.get('/plans');
        return response.data;
    } catch (error) {
        console.error('Erro ao obter planos:', error);
        throw error;
    }
};

export const getPlanByIdApi = async (token: string, planId: number): Promise<PlanInfo> => {
    try {
        const response: AxiosResponse<PlanInfo> = await api.get(`/plans/${planId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao obter plano por ID:', error);
        throw error;
    }
};
