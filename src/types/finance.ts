export interface FinanceInfo {
  id?: number;
  company_id: number;
  category_id: number;
  description: string;
  value: number;
  date: string; // formato ISO, ex: '2025-07-23'
  type: 'entrada' | 'saida';
  created_at?: string;
  updated_at?: string;
}

export interface FinanceCreate {
  company_id: number;
  category_id: number;
  description: string;
  value: number;
  date: string;
  type: 'entrada' | 'saida';
}

export interface FinanceUpdate {
  category_id?: number;
  description?: string;
  value?: number;
  date?: string;
  type?: 'entrada' | 'saida';
}
