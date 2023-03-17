import { Box } from '@mui/material';
import { isSunday } from 'date-fns';
import { InternalCalendarEvent } from './index';

interface EventProps {
    day: Date;
    data: InternalCalendarEvent;
    width: number;
    edge?: 'start' | 'end' | 'both';
}

export const Event = ({ day, data, width, edge }: EventProps) => {
    // const isStart = isSameDay(day, data.start);
    // const isEnd = isSameDay(day, data.end);

    const isBoth = edge === 'both';
    const isStart = edge === 'start' || isBoth;
    const isEnd = edge === 'end' || isBoth;

    let w = width;
    if (isStart)
        w -= 4;
    if (isEnd)
        w -= 4;

    return (
        <Box
            sx={(theme) => ({
                width: w,
                height: 24,
                // ml: isStart ? .5 : (!isSunday(day) ? -.125 : 0),
                // mr: isEnd ? .5 : 0,
                px: .5,
                position: 'absolute',
                top: (24 + 4) * data.index,
                left: isStart ? 4 : 0,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                bgcolor: data.color,
                borderTopLeftRadius: isStart ? theme.shape.borderRadius : 0,
                borderBottomLeftRadius: isStart ? theme.shape.borderRadius : 0,
                borderTopRightRadius: isEnd ? theme.shape.borderRadius : 0,
                borderBottomRightRadius: isEnd ? theme.shape.borderRadius : 0,
                opacity: 'inherit'
            })}>
            {(isStart || isSunday(day)) && data.title}
        </Box>
    );
};
