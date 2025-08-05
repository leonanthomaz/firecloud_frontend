import { AxiosResponse } from 'axios';
import { api } from '.';
import { CompanyInfo, CompanyUpdate } from '../../types/company';

// EMPRESAS
export const getCompanyForChatApi = async (code: string): Promise<CompanyInfo> => {
    try {
        const response: AxiosResponse<CompanyInfo> = await api.get(`/company/code/${code}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCompanyApi = async (token: string, companyId: number): Promise<CompanyInfo> => {
    try {
        const response: AxiosResponse<CompanyInfo> = await api.get(`/company/${companyId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCompanyApi = async (token: string, companyId: number, companyData: CompanyUpdate): Promise<CompanyInfo> => {
    try {
        const response: AxiosResponse<CompanyInfo> = await api.put(`/company/${companyId}`, companyData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const associateCompanyForPlanApi = async (
    token: string,
    companyId: number,
    planId: number
): Promise<{ message: string; company: any }> => {
    try {
        const response: AxiosResponse<{ message: string; company: any }> = await api.put(
            `/company/${companyId}/associate-plan/${planId}`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Erro ao associar plano:', error);
        throw error;
    }
};

// Insere e Atualiza a imagem da logo
export const updateLogoImage = async (token: string, companyId: number, imageData: FormData): Promise<CompanyInfo> => {
  try {
    const response: AxiosResponse<CompanyInfo> = await api.post(`/company/${companyId}/upload-logo`, imageData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar a imagem da logo:', error);
    throw error;
  }
};

// Remove a logo
export const removeLogoImage = async (token: string, companyId: number): Promise<CompanyInfo> => {
  try {
    const response: AxiosResponse<CompanyInfo> = await api.delete(`/company/${companyId}/remove-logo`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar a imagem da logo:', error);
    throw error;
  }
};

export const changeTutorialCompanyApi = async (
  token: string,
  companyId: number
): Promise<{ message: string; }> => {
  try {
    const response: AxiosResponse<{ message: string; }> = await api.put(
      `company/tutorial/${companyId}`, {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar is_new_company:', error);
    throw error;
  }
};

