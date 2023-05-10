'use client';

import { Box, CSSObject, styled, Theme, Typography } from '@mui/material';

const codeStyled = (theme: Theme): CSSObject => ({
    margin: theme.spacing(0, .25),
    padding: theme.spacing(.25, .5),
    color: 'unset',
    fontFamily: 'HackGen, Consolas, monospace',
    fontSize: '.87em',
    userSelect: 'all',
    backgroundColor: theme.palette.mode === 'light' ? '#f8f8f8' : 'rgba(255, 255, 255, 0.12)',
    border: `solid 1px ${theme.palette.divider}`,
    borderRadius: theme.spacing(.5)
});

export const CodeStyleContainer = styled(Box)(({ theme }) => ({
    '& code': codeStyled(theme)
}));

export const Code = styled('code')(({ theme }) => codeStyled(theme));

const keyStyled = (theme: Theme): CSSObject => ({
    ...codeStyled(theme),
    color: theme.palette.text.primary,
    lineHeight: 'normal',
    textTransform: 'none',
    userSelect: 'none',
    borderBottom: `solid 3px ${theme.palette.divider}`,
    [theme.breakpoints.down('md')]: {
        display: 'none'
    }
});

export const KeyStyleContainer = styled(Box)(({ theme }) => ({
    '& kbd': keyStyled(theme)
}));

export const Key = styled(Code.withComponent('kbd'))(({ theme }) => keyStyled(theme));

export const translatableTypographyStyled = (theme: Theme): CSSObject => ({
    '& br': {
        '&.mobile': {
            [theme.breakpoints.up('md')]: {
                display: 'none'
            }
        },
        '&.desktop': {
            [theme.breakpoints.down('md')]: {
                display: 'none'
            }
        }
    }
});

export const TranslatableTypography = styled(Typography)(({ theme }) => translatableTypographyStyled(theme));

export const BrMobile = styled('br')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'none'
    }
}));

export const BrDesktop = styled('br')(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        display: 'none'
    }
}));
