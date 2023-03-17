import { CalendarEvent } from '../../../interfaces/bot';
import { TranslatableViewProps } from '../../../interfaces/view';

export interface InternalCalendarEvent extends CalendarEvent {
    index: number;
}

export interface CalendarViewProps extends TranslatableViewProps {
    events: InternalCalendarEvent[];
}
