import { Address } from "./address";

export interface CompanyInfo {
    id?: number;
    code?: string;
    plan_id: any;

    name: string;
    description?: string | null;
    industry?: string | null;
    cnpj?: string | null;
    phone?: string | null;
    website?: string | null;
    logo_url?: string | null;
    contact_email?: string | null;
    is_new_company?: boolean | null;
    tutorial_completed?: boolean | null;

    business_type?: string | null;
    status?: CompanyStatus;
    is_open?: CompanyOpen;
    opening_time?: string;
    closing_time?: string;
    working_days?: string[] | null;

    created_at?: string;
    updated_at?: string | null;
    deleted_at?: string | null;
    updated_by?: number | null;
    deleted_by?: number | null;

    social_media_links?: { [key: string]: string } | null;
    addresses: Address[];
}

export interface CompanyRequest {
    name: string;
    description?: string | null;
    industry?: string | null;
    cnpj?: string | null;
    phone?: string | null;
    website?: string | null;
    contact_email?: string | null;
    logo_url?: string | null;

    business_type?: string | null;

    opening_time?: string;
    closing_time?: string;
    working_days?: string[] | null;
    social_media_links?: { [key: string]: string } | null;
    addresses: Address[];
}

export type CompanyStatusUpdate = {
  new_status: CompanyStatus;
};

export type CompanyStatusResponse = {
  current_status: CompanyStatus;
  message?: string;
};

export interface CompanyUpdate extends Partial<CompanyRequest> {}

export enum CompanyStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  PENDING = "PENDING",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}

export enum CompanyOpen {
  OPEN = "OPEN",
  CLOSE = "CLOSE",
  MAINTENANCE = "MAINTENANCE"
}
