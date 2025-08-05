
export interface PaymentRequestType {
  issuerId: string;  
  paymentMethodId: string; 
  transactionAmount: number; 
  installments: number;
  payer: {
    email: string;
    identification: {
      number: string | "";
      type: string | "";
    };
  };
}

