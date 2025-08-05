import { CompanyInfo } from "./company";

export interface ProductType {
    id?: number;
    name: string;
    description?: string;
    price: number;
    category?: string;
    stock?: number;
    image?: string;
    company_id: number;
    company?: CompanyInfo;
    code?: string;
    created_at?: string;
    updated_at?: string | null;
    deleted_at?: string | null;
    updated_by?: number | null;
    deleted_by?: number | null;
}