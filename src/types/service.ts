import { CategoryType } from "./category_service";

export interface ServiceBase {
  name: string;
  description: string;
  price: number;
  category_id: number;
  image?: string;
  code?: string;
  availability?: boolean;
  duration: number;
  category?: CategoryType
}

export interface ServiceCreate extends ServiceBase {
  company_id: number;
}

export interface ServiceUpdate {
  name?: string;
  description?: string;
  price?: number;
  category_id?: number;
  image?: string;
  code?: string;
  availability?: boolean;
  duration?: number;
  availability_schedule?: Record<string, any>[];
  updated_by?: number;
}

export interface ServiceResponse extends ServiceBase {
  id: number;
  company_id: number;
  category_id: number;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
  updated_by?: number | null;
  deleted_by?: number | null;
  availability_schedule: Record<string, any>[];
  rating: number;
  reviews_count: number;
}

export interface ServiceCard {
  id: number;
  name: string;
  price: number;
  image?: string;
  duration: number;
  rating: number;
}
