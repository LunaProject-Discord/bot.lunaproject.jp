import { styled } from '@mui/material';

export const Code = styled('code')(({ theme }) => ({
    margin: theme.spacing(0, .25),
    padding: theme.spacing(.25, .5),
    color: 'unset',
    fontFamily: 'HackGen, Consolas, monospace',
    fontSize: '.87em',
    userSelect: 'all',
    backgroundColor: theme.palette.mode === 'light' ? '#f8f8f8' : 'rgba(255, 255, 255, 0.12)',
    border: `solid 1px ${theme.palette.divider}`,
    borderRadius: theme.spacing(.5)
}));

export const Hotkey = styled(Code.withComponent('kbd'))(({ theme }) => ({
    color: theme.palette.text.primary,
    lineHeight: 'normal',
    textTransform: 'none',
    userSelect: 'none',
    [theme.breakpoints.down('md')]: {
        display: 'none'
    }
}));
