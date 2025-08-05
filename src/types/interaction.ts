// Chat
export interface ChatMessage {
    message: string;
    company_id: number;
}

export interface InteractionType {
    id?: number;
    company_id: number;

    chat_id?: number;
    
    client_name?: string | null;
    client_contact?: string | null;
    
    outcome?: string | null;
    interaction_summary?: string | null;
    channel?: string | null;

    interaction_type?: string | null;
    sentiment?: string | null;

    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
    
    created_at?: string;
    updated_at?: string | null;
    deleted_at?: string | null;

    ai_generated_insights?: [];

}