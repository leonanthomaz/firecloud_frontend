// types/token_ia.ts
export interface TokenStatusResponse {
    provider: string;
    label: string;
    credits_used: number;
    credit_limit: number;
    is_free_tier: boolean;
    rate_limit_requests: number;
    rate_limit_interval: number;
    tokensOverTime?: { date: string; tokens: number }[];
    requestsOverTime?: { date: string; requests: number }[];
  }
  