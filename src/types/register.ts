export interface RegisterRequest {
    name: string | null;
    first_name: string | null;
    last_name: string | null;
    username: string;
    password_hash: string;
    email: string;

    is_admin?: boolean;
    is_register_google?: boolean;

    company_name?: string | null;
    cnpj?: string | null;
    business_type?: string | null;
    industry?: string | null;
    phone?: string | null;
    website?: string | null;

    plan_interest?: string | null;
    
    assistant_preference?: string | null;
    
    privacy_policy_version?: string | null;
    privacy_policy_accepted_at?: string | null;
    additional_info?: string | null;
}

export interface RegisterCompleteRequest {
    is_admin?: boolean;
    is_register_google?: boolean;

    company_name?: string | null;
    cnpj?: string | null;
    business_type?: string | null;
    industry?: string | null;
    phone?: string | null;
    website?: string | null;

    plan_interest?: string | null;
    assistant_preference?: string | null;
    privacy_policy_version?: string | null;
    privacy_policy_accepted_at?: string | null;
    additional_info?: string | null;
}


export interface RegisterResponse extends RegisterRequest {
    id: number;
    status: RegisterStatusEnum;
    created_at: string;
    updated_at?: string;
}

export enum RegisterStatusEnum {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
