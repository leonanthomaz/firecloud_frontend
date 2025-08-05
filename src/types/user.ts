import { Address } from "./address";

// Modelos comuns
export interface UserResponse {
    is_new_user: boolean | null;
    id: number;
    name: string | null;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    username: string;
    is_admin: boolean;
    company_id: number | null;

    addresses?: Address[] 

    is_register_google: boolean | null;
    
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
    updated_by: number | null;
    deleted_by: number | null;
}

export interface UserPassword {
    password: string | null;
}