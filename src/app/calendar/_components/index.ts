import { CalendarEvent } from '../../../interfaces/bot';
import { LocalizationProps } from '../../../interfaces/localization';

export interface InternalCalendarEvent extends CalendarEvent {
    index: number;
}

export interface CalendarViewProps extends LocalizationProps {
    events: InternalCalendarEvent[];
}
