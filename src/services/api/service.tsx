import { AxiosResponse } from 'axios';
import { api } from '.';
import {
  ServiceCreate,
  ServiceUpdate,
  ServiceResponse,
} from '../../types/service';

// LISTAR SERVIÇOS DE UMA EMPRESA
export const getServices = async (
  token: string,
  companyId: number
): Promise<ServiceResponse[]> => {
  try {
    const response: AxiosResponse<ServiceResponse[]> = await api.get(
      `/services/${companyId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao obter serviços:', error);
    throw error;
  }
};

// OBTER UM SERVIÇO ESPECÍFICO
export const getServiceById = async (
  token: string,
  companyId: number,
  serviceId: number
): Promise<ServiceResponse> => {
  try {
    const response: AxiosResponse<ServiceResponse> = await api.get(
      `/services/${companyId}/${serviceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao obter serviço:', error);
    throw error;
  }
};

// CRIAR SERVIÇO
export const createService = async (
  token: string,
  companyId: number,
  serviceData: ServiceCreate
): Promise<ServiceResponse> => {
  try {
    const response: AxiosResponse<ServiceResponse> = await api.post(
      `/services/${companyId}/`,
      serviceData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar serviço:', error);
    throw error;
  }
};

// ATUALIZAR SERVIÇO
export const updateService = async (
  token: string,
  companyId: number,
  serviceId: number,
  serviceData: ServiceUpdate
): Promise<ServiceResponse> => {
  try {
    const response: AxiosResponse<ServiceResponse> = await api.put(
      `/services/${companyId}/${serviceId}`,
      serviceData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    throw error;
  }
};

// DELETAR SERVIÇO
export const deleteService = async (
  token: string,
  companyId: number,
  serviceId: number
): Promise<{ message: string }> => {
  try {
    const response: AxiosResponse<{ message: string }> = await api.delete(
      `/services/${companyId}/${serviceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar serviço:', error);
    throw error;
  }
};
