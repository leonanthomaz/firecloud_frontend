import { AxiosResponse } from 'axios';
import { api } from '.';
import { RegisterCompleteRequest, RegisterRequest, RegisterResponse } from '../../types/register';

// CRIAR PRÉ-CADASTRO
export const createRegisterApi = async (registerData: RegisterRequest): Promise<RegisterResponse> => {
    try {
        const response: AxiosResponse<RegisterResponse> = await api.post('/register/create', registerData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// CRIAR PRÉ-CADASTRO COM GOOGLE
export const createGoogleRegisterApi = async (googleToken: string): Promise<RegisterResponse> => {
    try {
        const response: AxiosResponse<RegisterResponse> = await api.post('/register/google', {
            token: googleToken,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// COMPLETAR PRÉ-CADASTRO
export const completeRegisterApi = async (
    registerId: number,
    registerData: Partial<RegisterCompleteRequest>
): Promise<RegisterResponse> => {
    try {
        const response: AxiosResponse<RegisterResponse> = await api.put(`/register/${registerId}`, registerData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// BUSCAR UM PRÉ-CADASTRO PELO ID
export const getRegisterApi = async (registerId: number): Promise<RegisterResponse> => {
    try {
        const response: AxiosResponse<RegisterResponse> = await api.get(`/register/${registerId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// BUSCAR TODOS OS PRÉ-CADASTROS
export const getAllRegistersApi = async (token: string): Promise<RegisterResponse[]> => {
    try {
        const response: AxiosResponse<RegisterResponse[]> = await api.get('/register/all', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ATUALIZAR PRÉ-CADASTRO (EX: APROVAR OU REJEITAR)
export const updateRegisterApi = async (token: string, registerId: number, registerData: Partial<RegisterRequest>): Promise<RegisterResponse> => {
    try {
        const response: AxiosResponse<RegisterResponse> = await api.put(`/register/${registerId}`, registerData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// DELETAR PRÉ-CADASTRO
export const deleteRegisterApi = async (token: string, registerId: number): Promise<{ message: string }> => {
    try {
        const response: AxiosResponse<{ message: string }> = await api.delete(`/register/${registerId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// APROVAR PRÉ-CADASTRO
export const approveRegisterApi = async (
  token: string,
  registerId: number
): Promise<{ message: string }> => {
  try {
    const response: AxiosResponse<{ message: string }> = await api.put(
      `/register/${registerId}/approve`,
      {}, // sem body
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// REJEITAR PRÉ-CADASTRO
export const rejectRegisterApi = async (
  token: string,
  registerId: number
): Promise<{ message: string }> => {
  try {
    const response: AxiosResponse<{ message: string }> = await api.put(
      `/register/${registerId}/reject`,
      {}, // sem body
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
