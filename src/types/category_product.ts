// Category
export interface CategoryType {
    id: number;
    name: string;
    company_id: number;
}

export interface CategoryUpdate {
    id: number;
    name?: string;
    company_id?: number;
}

export interface CategoryCreateType {
    name: string;
    company_id: number;
}