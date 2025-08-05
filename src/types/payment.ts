// types/payment.ts

// Enums para status, tipo e método
export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  PREPAID = "PREPAID",
  OVERDUE = "OVERDUE",
  TRIAL = "TRIAL",
  FAILED = "FAILED",
  CANCELED = "CANCELED"
}

export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  PIX = "PIX",
  BOLETO = "BOLETO",
  PAYPAL = "PAYPAL",
  TRANSFER = "TRANSFER"
}

export enum PaymentType {
  PLAN = "PLAN",
  CREDIT = "CREDIT",
  PAYMENT = "PAYMENT",
  BONUS = "BONUS"
}

// Interface principal da resposta de pagamento (alinhado com backend)
export interface PaymentResponse {
  id: number;
  company_id: number;
  plan_id?: number;
  credit_id?: number;

  type: PaymentType;
  reference_id: number;
  name?: string;
  slug?: string;
  description?: string;

  quantity: number;
  amount: number;
  total: number;

  status: PaymentStatus;
  payment_method?: PaymentMethod | null;
  transaction_id?: string | null;
  transaction_code?: string | null;
  invoice_id?: string | null;

  qr_code?: string | null;
  qr_code_base64?: string | null;

  paid_at?: string | null;
  valid_from?: string | null;
  valid_until?: string | null;
  valid_until_with_grace?: string | null;

  created_at: string;
  updated_at?: string | null;
}

// Interface opcional estendida com possíveis campos extras (se implementar depois)
export interface PaymentResponseExtended extends PaymentResponse {
  invoice_url?: string | null;
  customer_id?: string | null;
  subscription_id?: string | null;
  payment_details?: Record<string, any> | null;
  refunded_amount?: number | null;
  refund_date?: string | null;
  notes?: string | null;
}

// Interface para criação de pagamento
export interface PaymentRequest {
  company_id: number;
  plan_id?: number;
  credit_id?: number;

  type: PaymentType;
  reference_id: number;
  name?: string;
  slug?: string;
  description?: string;

  quantity?: number;
  amount: number;
  total?: number;

  status?: PaymentStatus;
  payment_method?: PaymentMethod | null;
  transaction_id?: string | null;
  transaction_code?: string | null;
  invoice_id?: string | null;

  qr_code?: string | null;
  qr_code_base64?: string | null;

  paid_at?: string | null;
  valid_from?: string | null;
  valid_until?: string | null;
  valid_until_with_grace?: string | null;
}

// Interface para atualização de pagamento
export interface PaymentUpdate {
  payment_id?: number | null;
  plan_id?: number | null;
  credit_id?: number | null;

  name?: string;
  description?: string;
  quantity?: number | null;
  amount?: number | null;
  total?: number | null;

  valid_from?: string | null;
  valid_until?: string | null;
  valid_until_with_grace?: string | null;
  status?: PaymentStatus | null;

  paid_at?: string | null;
  transaction_id?: string | null;
  transaction_code?: string | null;
  invoice_id?: string | null;
  qr_code?: string | null;
  qr_code_base64?: string | null;
}

// Interface para verificação de status
export interface PaymentStatusCheck {
  status: PaymentStatus;
  transaction_id?: string | null;
  valid_until?: string | null;
  is_active?: boolean;
}

// Tipos auxiliares para formulários (Date ao invés de string)
export interface PaymentFormValues extends Omit<PaymentRequest, 'valid_from' | 'valid_until' | 'paid_at'> {
  paid_at?: Date | null;
  valid_from?: Date | null;
  valid_until?: Date | null;
}

// Interface para iniciar o processo de pagamento
export interface PaymentPixProcess {
  payment_id: number;
  company_id: number;
  amount: number;
  
  payment_method: PaymentMethod;

  token?: string | null;
  payment_method_id?: string | null;
  installments?: number | null;
  document_number?: string | null;

  qr_code?: string | null;
  qr_code_base64?: string | null;
}

// Resposta específica para QR Code Pix
export interface PaymentQRCodeResponse {
  qr_code: string;
  qr_code_base64: string;
  company_id?: number;
  amount?: number;
  status?: PaymentStatus;
  transaction_code?: string;
}

// Tipo para listagem
export type PaymentListResponse = PaymentResponse[];
