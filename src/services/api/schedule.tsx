import { AxiosResponse } from 'axios';
import { api } from '.';
import { Schedule, ScheduleCreate, ScheduleUpdate } from '../../types/schedule';

// GET todos os agendamentos
export const getSchedulesApi = async (): Promise<Schedule[]> => {
  try {
    const response: AxiosResponse<Schedule[]> = await api.get('/schedule');
    return response.data;
  } catch (error) {
    console.error('Erro ao obter agendamentos:', error);
    throw error;
  }
};

// GET agendamento por ID
export const getScheduleByIdApi = async (
  scheduleId: number,
  token?: string
): Promise<Schedule> => {
  try {
    const response: AxiosResponse<Schedule> = await api.get(`/schedule/${scheduleId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar agendamento ${scheduleId}:`, error);
    throw error;
  }
};

export const getAvailableScheduleByCompanyApi = async (
  companyId: number,
  token?: string
): Promise<Schedule[]> => {
  try {
    const response: AxiosResponse<Schedule[]> = await api.get(
      `/schedule/by-company`,
      {
        params: { company_id: companyId },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar agendamentos disponíveis da empresa ${companyId}:`, error);
    throw error;
  }
};

// POST criar agendamento
export const createScheduleApi = async (
  data: ScheduleCreate,
  token?: string
): Promise<Schedule> => {
  try {
    const response: AxiosResponse<Schedule> = await api.post('/schedule', data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    throw error;
  }
};

// PUT atualizar agendamento
export const updateScheduleApi = async (
  scheduleId: number,
  data: ScheduleUpdate,
  token?: string
): Promise<Schedule> => {
  try {
    const response: AxiosResponse<Schedule> = await api.put(`/schedule/${scheduleId}`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar agendamento ${scheduleId}:`, error);
    throw error;
  }
};

// DELETE remover agendamento
export const deleteScheduleApi = async (
  scheduleId: number,
  token?: string
): Promise<void> => {
  try {
    await api.delete(`/schedule/${scheduleId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (error) {
    console.error(`Erro ao deletar agendamento ${scheduleId}:`, error);
    throw error;
  }
};
