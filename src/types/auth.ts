import { CompanyInfo } from "./company";
import { UserResponse } from "./user";

// Padrão
export interface MeResponse {
    token: any;
    user: UserResponse;
    company: CompanyInfo;
}

export interface RegisterData {
    name: string;
    email: string;
    username: string;
    password: string;
    is_admin?: boolean | null;
    company_id?: number | null;
}
