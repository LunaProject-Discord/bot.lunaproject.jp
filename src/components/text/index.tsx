'use client';

import { Box, CSSObject, styled, Theme, Typography } from '@mui/material';
import { SystemStyleObject } from '@mui/system/styleFunctionSx/styleFunctionSx';

export const codeStyled = (theme: Theme): SystemStyleObject<Theme> => ({
    margin: theme.spacing(0, .25),
    padding: theme.spacing(.25, .5),
    fontFamily: 'HackGen, Consolas, monospace',
    fontSize: '.87em',
    userSelect: 'all',
    color: 'unset',
    backgroundColor: '#f8f8f8',
    border: `solid 1px ${theme.vars.palette.divider}`,
    borderRadius: theme.spacing(.5),
    ...theme.applyStyles('dark', {
        backgroundColor: 'rgba(255, 255, 255, 0.12)'
    })
});

export const CodeStyleContainer = styled(Box)(({ theme }) => ({
    '& code': codeStyled(theme)
}));

export const Code = styled('code')(({ theme }) => ({
    ...codeStyled(theme)
}));

export const keyStyled = (theme: Theme): SystemStyleObject<Theme> => ({
    ...codeStyled(theme),
    padding: theme.spacing(0, .5),
    fontFamily: 'Renner, sans-serif',
    fontWeight: 'bold',
    lineHeight: 'normal',
    letterSpacing: .5,
    textTransform: 'none',
    userSelect: 'none',
    color: theme.vars.palette.text.secondary,
    backgroundColor: theme.vars.palette.grey[100],
    borderBottom: `solid 3px ${theme.vars.palette.divider}`,
    ...theme.applyStyles('dark', {
        backgroundColor: theme.vars.palette.grey[900]
    }),
    '@media (any-hover: none)': {
        display: 'none'
    }
});

export const KeyStyleContainer = styled(Box)(({ theme }) => ({
    '& kbd': keyStyled(theme)
}));

export const Key = styled(Code.withComponent('kbd'))(({ theme }) => ({
    ...keyStyled(theme)
}));

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
