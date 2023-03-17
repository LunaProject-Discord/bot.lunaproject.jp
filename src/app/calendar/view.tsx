'use client';

import { format } from '@lunaproject-discord/web-core/dist/utils/date';
import { KeyboardArrowLeftOutlined, KeyboardArrowRightOutlined } from '@mui/icons-material';
import { Box, IconButton, styled, Typography } from '@mui/material';
import { addMonths, eachDayOfInterval, subMonths } from 'date-fns';
import React, { useState } from 'react';
import { PageContent } from '../../components/layout';
import { CalendarEvent } from '../../interfaces/bot';
import { TranslatableViewProps } from '../../interfaces/view';
import { InternalCalendarEvent } from './components';
import { MonthView } from './components/month';

const AppBar = styled('header')(({ theme }) => ({
    height: 57,
    display: 'flex',
    alignItems: 'center',
    borderBottom: `solid 1px ${theme.palette.divider}`
}));

const events: CalendarEvent[] = [
    {
        title: 'どまんなか得の市',
        color: '#e60014',
        start: new Date(2023, 2, 17),
        end: new Date(2023, 2, 20),
        allDay: true
    },
    {
        title: 'いち・に・さんの市',
        color: '#094',
        start: new Date(2023, 2, 1),
        end: new Date(2023, 2, 3),
        allDay: true
    },
    {
        title: 'nanaco新規入会キャンペーン',
        color: '#ff9800',
        start: new Date(2023, 2, 1),
        end: new Date(2023, 2, 13),
        allDay: true
    },
    {
        title: 'ナナコ新規入会キャンペーン',
        color: '#959ac0',
        start: new Date(2023, 2, 3),
        end: new Date(2023, 2, 4),
        allDay: true
    },
    {
        title: '休日',
        color: '#ff00ff',
        start: new Date(2023, 2, 4),
        end: new Date(2023, 2, 5),
        allDay: true
    }
];

export const View = ({ translations }: TranslatableViewProps) => {
    const [date, setDate] = useState(new Date());

    const internalEvents = events.sort((a, b) => {
        const aDays = eachDayOfInterval({ start: a.start, end: a.end });
        const bDays = eachDayOfInterval({ start: b.start, end: b.end });
        return bDays.length - aDays.length;
    }).map((event, index): InternalCalendarEvent => ({ ...event, index }));

    return (
        <PageContent sx={{ maxWidth: 'none !important', p: 0, overflow: 'hidden' }}>
            <AppBar>
                <Box sx={{ mx: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={() => setDate((date) => subMonths(date, 1))}>
                        <KeyboardArrowLeftOutlined color="action" />
                    </IconButton>
                    <Typography variant="h5">
                        {format(date, 'yyyy年M月')}
                    </Typography>
                    <IconButton onClick={() => setDate((date) => addMonths(date, 1))}>
                        <KeyboardArrowRightOutlined color="action" />
                    </IconButton>
                </Box>
            </AppBar>
            <MonthView date={date} setDate={setDate} events={internalEvents} translations={translations} />
        </PageContent>
    );
};
