export interface PlanInfo {
    is_current: any;
    id?: number;
    name: string;
    slug?: string | null;
    description?: string | null;
    price: number;
    features?: {} | null;
    status?: string | null;
    created_at?: string;
    updated_at?: string | null;
    interval?: string | null;
    interval_count?: number | null;
    trial_period_days?: number | null;
    max_users?: number | null;
    max_storage?: number | null;
    max_api_calls?: number | null;
    max_tokens?: number | null;
}

export interface PlanResponse {
    id: number;
    name: string;
    slug?: string | null;
    description: string | null;
    price: number;
    features?: {} | null;
    status: string | null;
    created_at: string;
    updated_at: string | null;
    interval: string | null;
    interval_count: number | null;
    trial_period_days: number | null;
    max_users: number | null;
    max_storage: number | null;
    max_api_calls: number | null;
    max_tokens: number | null;
}

export interface PlanCreateData {
    name: string;
    slug?: string | null;
    description?: string | null;
    price: number;
    features?: {} | null;
    status?: string | null;
    interval?: string | null;
    interval_count?: number | null;
    trial_period_days?: number | null;
    max_users?: number | null;
    max_storage?: number | null;
    max_api_calls?: number | null;
    max_tokens?: number | null;
}

export interface PlanUpdateData {
    name?: string;
    slug?: string | null;
    description?: string | null;
    price?: number;
    features?: {} | null;
    status?: string | null;
    interval?: string | null;
    interval_count?: number | null;
    trial_period_days?: number | null;
    max_users?: number | null;
    max_storage?: number | null;
    max_api_calls?: number | null;
    max_tokens?: number | null;
}