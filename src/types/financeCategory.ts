export interface FinanceCategoryInfo {
  id: number;
  company_id: number;
  name: string;
  type: 'entrada' | 'saida';
  created_at: string;
  updated_at: string;
}

export interface FinanceCategoryCreate {
  company_id: number;
  name: string;
  type: 'entrada' | 'saida';
}

export interface FinanceCategoryUpdate {
  name?: string;
  type?: 'entrada' | 'saida';
}
