import { Box, styled, Theme } from '@mui/material';

const codeStyled = (theme: Theme) => ({
    margin: theme.spacing(0, .25),
    padding: theme.spacing(.25, .5),
    color: 'unset',
    fontFamily: 'HackGen, Consolas, monospace',
    fontSize: '.87em',
    ['userSelect' as any]: 'all',
    backgroundColor: theme.palette.mode === 'light' ? '#f8f8f8' : 'rgba(255, 255, 255, 0.12)',
    border: `solid 1px ${theme.palette.divider}`,
    borderRadius: theme.spacing(.5)
});

export const CodeStyleContainer = styled(Box)(({ theme }) => ({
    '& code': codeStyled(theme)
}));

export const Code = styled('code')(({ theme }) => codeStyled(theme));

const hotkeyStyled = (theme: Theme) => ({
    ...codeStyled(theme),
    color: theme.palette.text.primary,
    lineHeight: 'normal',
    ['textTransform' as any]: 'none',
    ['userSelect' as any]: 'none',
    [theme.breakpoints.down('md')]: {
        display: 'none'
    }
});

export const HotkeyStyleContainer = styled(Box)(({ theme }) => ({
    '& kbd': hotkeyStyled(theme)
}));

export const Hotkey = styled(Code.withComponent('kbd'))(({ theme }) => hotkeyStyled(theme));
