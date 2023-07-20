export interface UserCalendarEvent {
    title: string;
    description?: string;
    color: string;
    start: Date;
    end: Date;
    allDay?: boolean;
}
