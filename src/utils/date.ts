import { addHours, subHours } from 'date-fns';

export const toDBDate = (date: Date) => {
    const offset = date.getTimezoneOffset();
    return offset < 0 ? addHours(date, Math.abs(offset) / 60) : subHours(date, Math.abs(offset) / 60);
};

export const fromDBDate = (date: Date) => {
    const offset = date.getTimezoneOffset();
    return offset < 0 ? subHours(date, Math.abs(offset) / 60) : addHours(date, Math.abs(offset) / 60);
};
