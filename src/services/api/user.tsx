import { AxiosResponse } from 'axios';
import { api } from '.';

export const updateUserApi = async (token: string, userId: number, userData: any): Promise<any> => {
    try {
        const response: AxiosResponse<any> = await api.put(`/customer/users/${userId}`, userData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar usuário: ", error)
        throw error;
    }
};

export const updateUserPassword = async (
  token: string,
  userId: number,
  data: { current_password?: string; new_password: string }
): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await api.put(`/customer/users/${userId}/password`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

