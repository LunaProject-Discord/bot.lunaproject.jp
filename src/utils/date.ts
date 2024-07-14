import { addHours } from 'date-fns/addHours';
import { subHours } from 'date-fns/subHours';

export const toDBDate = (date: Date) => {
    const offset = date.getTimezoneOffset() !== 0 ? date.getTimezoneOffset() : -(9 * 60);
    return offset < 0 ? addHours(date, Math.abs(offset) / 60) : subHours(date, Math.abs(offset) / 60);
};

export const fromDBDate = (date: Date) => {
    const offset = date.getTimezoneOffset() !== 0 ? date.getTimezoneOffset() : -(9 * 60);
    return offset < 0 ? subHours(date, Math.abs(offset) / 60) : addHours(date, Math.abs(offset) / 60);
};
