export interface AssistantInfo {
    id: number;
    company_id: number;
    status: string | null;
    assistant_name: string | null;
    assistant_api_url: string | null;
    assistant_api_key: string | null;
    assistant_link: string | null;
    assistant_type: string | null;
    assistant_model: string | null;
    assistant_token_limit: number | null;
    assistant_token_usage: number;
    assistant_token_reset_date: string | null;
    created_at: string; 
    updated_at: string | null;
}

export enum ChatbotStatus {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE",
    MAINTENANCE = "MAINTENANCE"
}