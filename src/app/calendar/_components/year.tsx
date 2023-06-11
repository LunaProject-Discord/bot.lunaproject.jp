import { LocalizationProps } from '@interfaces/localization';
import { Box, styled } from '@mui/material';

const Week = styled(Box)(({ theme }) => ({
    gridColumn: '1 / 8',
    gridRow: 'span 1',
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    '&:not(:first-child)': {
        borderTop: `solid 1px ${theme.palette.divider}`
    }
}));

const Day = styled(Box)(({ theme }) => ({
    gridRow: 'span 1',
    display: 'flex',
    flexDirection: 'column',
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

const DayOfWeek = styled(Day)({
    flexDirection: 'row',
    placeItems: 'center',
    placeContent: 'center'
});

interface YearViewProps extends LocalizationProps {
    year: number;
}
