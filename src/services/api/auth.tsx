import { AxiosResponse } from 'axios';
import { api } from '.';
import { MeResponse, RegisterData } from '../../types/auth';

// AUTORIZAÇÃO
export const loginApi = async (username: string, password: string): Promise<string> => {
    try {
        const response: AxiosResponse<{ token: string }> = await api.post('/login', { username, password });
        return response.data.token;
    } catch (error) {
        throw error;
    }
};

export const registerApi = async (data: RegisterData): Promise<string> => {
    try {
        const response = await api.post('/cadastro', data);
        return response.data.token;
    } catch (error) {
        throw error;
    }
};

export const getUserDetailsApi = async (token: string): Promise<MeResponse> => {
    try {
        const response: AxiosResponse<MeResponse> = await api.get('/me', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginWithGoogleApi = async (googleToken: string): Promise<{ token: string }> => {
    try {
        const response: AxiosResponse<{ token: string }> = await api.post('/auth/google', {
            token: googleToken,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const validateEmailApi = async (email: string): Promise<void> => {
    try {
        await api.post('/validate-email', { email });
    } catch (error) {
        throw error;
    }
};

export const changePasswordApi = async (
    password: string,
    token: string
): Promise<void> => {
    try {
        await api.post('/reset-password', {
            password: password,
            token: token,
        });
    } catch (error) {
        throw error;
    }
};