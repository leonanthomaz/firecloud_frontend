export interface Address {
  id?: number;
  street: string;
  number: string;
  neighborhood: string;
  zip_code: string;
  complement?: string;
  city?: string;
  state?: string;
  reference?: string;
  is_company_address?: boolean | null;
  is_main_address?: boolean | null;
  is_home_address?: boolean | null;
}
