// Representa o slot completo retornado do backend
export interface ScheduleSlot {
  id: number;
  public_id: string;
  start: string; // ISO datetime
  end: string;
  all_day: boolean;
  is_active: boolean;
  is_recurring: boolean;
  company_id: number;
  service_id?: number | null;
  schedule_id?: number | null;
  created_at: string;
  updated_at: string;
}

// Para criação de um novo slot
export interface ScheduleSlotCreate {
  start: string; // ISO datetime
  end: string;
  all_day?: boolean;
  is_active?: boolean;
  is_recurring?: boolean;
  company_id: number;
  service_id?: number | null;
  schedule_id?: number | null;
}

// Para edição (atualização parcial)
export interface ScheduleSlotUpdate {
  start?: string;
  end?: string;
  all_day?: boolean;
  is_active?: boolean;
  is_recurring?: boolean;
  company_id?: number;
  service_id?: number | null;
  schedule_id?: number | null;
}
