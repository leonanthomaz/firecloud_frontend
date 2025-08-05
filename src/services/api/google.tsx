import { AxiosResponse } from 'axios';
import moment from 'moment';
import { api } from '.';
import { GoogleCalendarEventRequestType, GoogleCalendarEventUpdateType } from '../../types/google';

const GOOGLE_API_URL = '/api/google_calendar/events';

// Função para criar evento
export const createGoogleEvent = async (authToken: string, googleToken: any, eventData: GoogleCalendarEventRequestType): Promise<any> => {
    try {
        const formattedEventData = {
            ...eventData,
            start_time: moment(eventData.start_time).utc().format(),
            end_time: moment(eventData.end_time).utc().format(),
        };
        const response: AxiosResponse<any> = await api.post(GOOGLE_API_URL, {
            googleToken: JSON.stringify(googleToken), // Envia como parâmetro
            ...formattedEventData,
        }, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar evento no Google Agenda:', error);
        throw error;
    }
};

// Função para listar eventos
export const listGoogleEvents = async (authToken: string, googleToken: any) => {

    try {
        const response = await api.get(GOOGLE_API_URL, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            params: {
                googleToken: JSON.stringify(googleToken), // Envia como parâmetro
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Erro ao listar eventos do Google Agenda:', error);
        throw error;
    }
};

// Função para editar evento
export const updateGoogleEvent = async (authToken: string, googleToken: any, eventId: string, eventData: GoogleCalendarEventUpdateType) => {
    try {
        const formattedEventData = {
            ...eventData,
            start_time: moment(eventData.start_time).utc().format(),
            end_time: moment(eventData.end_time).utc().format(),
        };
        const response = await api.patch(`${GOOGLE_API_URL}/${eventId}`, {
            googleToken: JSON.stringify(googleToken), // Envia como parâmetro
            ...formattedEventData,
        }, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar evento no Google Agenda:', error);
        throw error;
    }
};

// Função para excluir evento
export const deleteGoogleEvent = async (authToken: string, googleToken: any, eventId: string) => {
    try {
        await api.delete(`${GOOGLE_API_URL}/${eventId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            data: {
                googleToken: JSON.stringify(googleToken), // Envia como parâmetro
            }
        });
    } catch (error) {
        console.error('Erro ao excluir evento do Google Agenda:', error);
        throw error;
    }
};