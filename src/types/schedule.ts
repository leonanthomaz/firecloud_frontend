export interface ScheduleBase {
  title: string;
  start: string;
  end?: string | null;
  all_day?: boolean;
  color?: string;

  company_id: number;
  service_id?: number | null;

  status?: string;
  description?: string;
  location?: string;
  customer_name?: string;
  customer_contact?: string;
  extended_props?: Record<string, any>;
}

// 🟢 Para criação
export interface ScheduleCreate extends ScheduleBase {}

// 🟡 Para atualização parcial
export interface ScheduleUpdate {
  title?: string;
  start?: string;
  end?: string;
  all_day?: boolean;
  color?: string;

  company_id?: number;
  service_id?: number;

  status?: string;
  description?: string;
  location?: string;
  customer_name?: string;
  customer_contact?: string;
  extended_props?: Record<string, any>;
}

// 🔵 Resposta completa
export interface Schedule extends ScheduleBase {
  id: number;
  public_id: string; // UUID
  created_at: string;
  updated_at: string;
  created_by?: number | null;
}
