// Enum para PaymentStatus (equivalente ao backend)
export enum PaymentStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    PREPAID = "PREPAID",
    OVERDUE = "OVERDUE",
    TRIAL = "TRIAL",
    FAILED = "FAILED",
    CANCELED = "CANCELED"

}

// Enum para PaymentMethod
export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  PIX = 'PIX',
  BOLETO = 'BOLETO',
  PAYPAL = 'PAYPAL',
  TRANSFER = 'TRANSFER'
}

export enum PaymentType {
    PLAN = "PLAN",
    CREDIT = "CREDIT",
    PAYMENT = "PAYMENT",
    BONUS = "BONUS"
}

export interface PaymentItem {
  id?: number
  payment_id: number

  type: PaymentType
  reference_id: number
  name?: string
  slug?: string
  description?: string
  token_amount?: number

  quantity: number
  amount: number
  total: number

  status?: PaymentStatus
  valid_from?: string
  valid_until?: string
  valid_until_with_grace?: string

  created_at: string
  updated_at?: string
}
