import { format } from '@lunaproject-discord/web-core/dist/utils/date';
import { Box, styled } from '@mui/material';
import { blue, red } from '@mui/material/colors';
import {
    addMonths,
    eachDayOfInterval,
    eachWeekOfInterval,
    endOfMonth,
    endOfWeek,
    isBefore,
    isSameDay,
    isSameWeek,
    isSaturday,
    isSunday,
    isToday,
    isWithinInterval,
    startOfMonth,
    subMonths
} from 'date-fns';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState, WheelEvent } from 'react';
import { Event } from './event';
import { CalendarViewProps, InternalCalendarEvent } from './index';

const Week = styled(Box)(({ theme }) => ({
    gridColumn: '1 / 8',
    gridRow: 'span 1',
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    '&:not(:first-child)': {
        borderTop: `solid 1px ${theme.palette.divider}`
    }
}));

const DayOfWeek = styled(Box)(({ theme }) => ({
    gridRow: 'span 1',
    display: 'flex',
    flexDirection: 'row',
    placeItems: 'center',
    placeContent: 'center',
    gap: theme.spacing(.5),
    '&:not(:first-child)': {
        borderLeft: `solid 1px ${theme.palette.divider}`
    }
}));

const DayHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(.5),
    display: 'flex',
    alignItems: 'center'
}));

const DayEventList = styled(Box)(({ theme }) => ({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(.5)
}));

interface DayLabelProps {
    today?: boolean;
}

const DayLabel = styled(
    Box,
    { shouldForwardProp: (prop) => prop !== 'sx' && prop !== 'today' }
)<DayLabelProps>(({ theme, today = false }) => ({
    width: theme.spacing(4),
    height: theme.spacing(4),
    padding: theme.spacing(.5),
    display: 'flex',
    placeItems: 'center',
    placeContent: 'center',
    color: today ? theme.palette.primary.contrastText : theme.palette.text.primary,
    backgroundColor: today ? theme.palette.primary.main : 'none',
    borderRadius: '50%'
}));

interface DayProps {
    day: Date;
    selectedDate: Date;
    events: InternalCalendarEvent[];
    columnWidth: number;
}

export const Day = ({ day, selectedDate, events, columnWidth }: DayProps) => {
    const sortedEvents = events.sort((a, b) => Number(a.allDay) - Number(b.allDay))
        .sort((a, b) => {
            const aDays = eachDayOfInterval({ start: a.start, end: a.end });
            const bDays = eachDayOfInterval({ start: b.start, end: b.end });
            return bDays.length - aDays.length;
        });

    if (sortedEvents.length > 0)
        console.log(day, sortedEvents);

    const index = sortedEvents.filter((event) => !isSameDay(day, event.start) && !isSunday(day)).length;


    const isMonth = selectedDate.getFullYear() === day.getFullYear() && selectedDate.getMonth() === day.getMonth();
    return (
        <Box
            sx={{
                gridRow: 'span 1',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: day.getDay() === 0 ? red[50] : (day.getDay() === 6 ? blue[50] : undefined),
                opacity: isMonth ? 1 : .5,
                '&:not(:first-child)': {
                    borderLeft: (theme) => `solid 1px ${theme.palette.divider}`
                }
            }}
        >
            <DayHeader>
                <DayLabel today={isToday(day)}>
                    {isMonth ? day.getDate() : format(day, 'M/d')}
                </DayLabel>
            </DayHeader>
            <DayEventList>
                {sortedEvents
                    .filter((event) => isSameDay(day, event.start) || isSunday(day))
                    .map((event, i) => {
                        let edge: 'start' | 'end' | 'both' | undefined = 'start';
                        let dayCount = 1;

                        if (!isSaturday(day)) {
                            const days = eachDayOfInterval({ start: day, end: endOfWeek(day) });
                            dayCount = days.length;
                        }

                        if (isBefore(event.end, endOfWeek(day))) {
                            const days = eachDayOfInterval({ start: day, end: event.end });
                            dayCount = days.length;
                        }

                        if (isSameWeek(day, event.end))
                            edge = isSameDay(day, event.start) ? 'both' : 'end';
                        else if (isSunday(day))
                            edge = undefined;

                        return (
                            <Event
                                key={i}
                                day={day}
                                data={{ ...event, index: index + i }}
                                width={(columnWidth * dayCount)}
                                edge={edge}
                            />
                        );
                    })
                }
            </DayEventList>
        </Box>
    );
};

interface MonthProps extends CalendarViewProps {
    year: number;
    month: number;
    visible?: boolean;
}

export const Month = ({ year, month, events, visible = true }: MonthProps) => {
    const ref = useRef<HTMLDivElement | null>(null);

    const [columnWidth, setColumnWidth] = useState(0);

    useEffect(() => {
        if (ref.current)
            setColumnWidth(Number((ref.current!!.clientWidth / 7).toFixed(3)));
    }, [ref.current]);

    const date = new Date(year, month, 1);
    const sundays = eachWeekOfInterval({
        start: startOfMonth(date),
        end: endOfMonth(date)
    });
    const weeks = sundays.map((sunday) => eachDayOfInterval({ start: sunday, end: endOfWeek(sunday) }));

    return (
        <Box ref={ref} sx={{ height: '100%', display: visible ? 'block' : 'none' }}>
            <Box sx={{
                height: '100%',
                display: 'grid',
                gridTemplateColumns: `repeat(7, ${columnWidth > 0 ? `${columnWidth}px` : '1fr'})`,
                gridTemplateRows: `48px repeat(${weeks.length}, 1fr)`
            }}>
                <Week>
                    <DayOfWeek sx={{ bgcolor: red[50] }}>日</DayOfWeek>
                    <DayOfWeek>月</DayOfWeek>
                    <DayOfWeek>火</DayOfWeek>
                    <DayOfWeek>水</DayOfWeek>
                    <DayOfWeek>木</DayOfWeek>
                    <DayOfWeek>金</DayOfWeek>
                    <DayOfWeek sx={{ bgcolor: blue[50] }}>土</DayOfWeek>
                </Week>
                {weeks.map((week, row) => (
                    <Week key={row}>
                        {week.map((day, column) => (
                            <Day
                                key={column}
                                day={day}
                                selectedDate={date}
                                events={events.filter(({ start, end }) => isWithinInterval(day, { start, end }))}
                                columnWidth={columnWidth}
                            />
                        ))}
                    </Week>
                ))}
            </Box>
        </Box>
    );
};

interface MonthViewProps extends CalendarViewProps {
    date: Date;
    setDate: Dispatch<SetStateAction<Date>>;
}

export const MonthView = ({ date, setDate, events, translations }: MonthViewProps) => {
    const [wheelAmount, setWheelAmount] = useState<number | null>(null);

    const handleMouseWheel = (e: WheelEvent) => {
        const amount = Math.trunc(e.deltaY);
        const absoluteAmount = Math.abs(amount);

        if (!wheelAmount || wheelAmount >= absoluteAmount)
            setWheelAmount(absoluteAmount);

        if (absoluteAmount >= wheelAmount!! * 2) return;

        setDate((date) => e.deltaY > 0 ? addMonths(date, 1) : subMonths(date, 1));
    };

    return (
        <Box onWheel={handleMouseWheel} sx={{ height: 'calc(100% - 57px)' }}>
            <Month
                year={subMonths(date, 1).getFullYear()}
                month={subMonths(date, 1).getMonth()}
                events={events}
                visible={false}
                translations={translations}
            />
            <Month
                year={date.getFullYear()}
                month={date.getMonth()}
                events={events}
                translations={translations}
            />
            <Month
                year={addMonths(date, 1).getFullYear()}
                month={addMonths(date, 1).getMonth()}
                events={events}
                visible={false}
                translations={translations}
            />
        </Box>
    );
};
