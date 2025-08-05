// Enum oficial, usar no backend também se possível
export type CreditOrigin = 'PLAN' | 'PACKAGE' | 'CREDIT' | 'BONUS' | 'PAYMENT';

// Base usado em create e update
export interface CreditBase {
  name?: string;               
  slug?: string;               
  features?: Record<string, any>; 
  token_amount: number;
  origin: CreditOrigin;
  description?: string;
  price: number;               
  plan_id?: number | null;
}

// Criação de crédito (POST)
export interface CreditCreate extends CreditBase {
  company_id: number;
}

// Atualização de crédito (PUT)
export interface CreditUpdate {
  name?: string;
  slug?: string;
  features?: Record<string, any>;
  token_amount?: number;
  origin?: CreditOrigin;
  description?: string;
  price?: number;
  plan_id?: number | null;
}

// Leitura (GET)
export interface Credit extends CreditBase {
  id: number;
  company_id: number;
  created_at: string; 
}
