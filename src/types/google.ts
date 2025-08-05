// Tipos para Eventos do Google Agenda
export interface GoogleCalendarEventRequestType {
    start_time: Date;
    end_time: Date;
    summary: string;
}

export interface GoogleCalendarEventUpdateType {
    start_time?: Date;
    end_time?: Date;
    summary?: string;
}
