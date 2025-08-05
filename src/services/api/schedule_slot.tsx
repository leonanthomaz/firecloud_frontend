import { AxiosResponse } from 'axios';
import { api } from '.';
import {
  ScheduleSlot,
  ScheduleSlotCreate,
  ScheduleSlotUpdate,
} from '../../types/schedule_slot';

// GET todos os slots de agendamento
export const getScheduleSlotsApi = async (): Promise<ScheduleSlot[]> => {
  try {
    const response: AxiosResponse<ScheduleSlot[]> = await api.get('/schedule-slot');
    return response.data;
  } catch (error) {
    console.error('Erro ao obter slots de agendamento:', error);
    throw error;
  }
};

// GET slots disponíveis por empresa
export const getAvailableScheduleSlotsByCompanyApi = async (
  companyId: number,
  token?: string
): Promise<ScheduleSlot[]> => {
  try {
    const response: AxiosResponse<ScheduleSlot[]> = await api.get(
      `/schedule-slot/by-company`,
      {
        params: { company_id: companyId },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar horas disponíveis da empresa ${companyId}:`, error);
    throw error;
  }
};

// GET slot de agendamento por ID
export const getScheduleSlotByIdApi = async (
  slotId: number,
  token?: string
): Promise<ScheduleSlot> => {
  try {
    const response: AxiosResponse<ScheduleSlot> = await api.get(`/schedule-slot/${slotId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar slot ${slotId}:`, error);
    throw error;
  }
};

// POST criar novo slot
export const createScheduleSlotApi = async (
  data: ScheduleSlotCreate,
  token?: string
): Promise<ScheduleSlot> => {
  try {
    const response: AxiosResponse<ScheduleSlot> = await api.post('/schedule-slot', data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar slot de agendamento:', error);
    throw error;
  }
};

// PUT atualizar slot existente
export const updateScheduleSlotApi = async (
  slotId: number,
  data: ScheduleSlotUpdate,
  token?: string
): Promise<ScheduleSlot> => {
  try {
    const response: AxiosResponse<ScheduleSlot> = await api.put(`/schedule-slot/${slotId}`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar slot ${slotId}:`, error);
    throw error;
  }
};

// DELETE excluir slot
export const deleteScheduleSlotApi = async (
  slotId: number,
  token?: string
): Promise<void> => {
  try {
    await api.delete(`/schedule-slot/${slotId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (error) {
    console.error(`Erro ao deletar slot ${slotId}:`, error);
    throw error;
  }
};
