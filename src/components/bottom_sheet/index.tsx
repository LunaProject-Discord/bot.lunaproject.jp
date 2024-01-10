import { ExpandMoreIcon } from '@components/icons';
import { LocalizationProps } from '@interfaces/localization';
import { Box, IconButton, styled, Tooltip } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import React from 'react';
import { BottomSheet as BottomSheetRoot } from 'react-spring-bottom-sheet';
import { SnapPointProps } from 'react-spring-bottom-sheet/dist/types';

export const BottomSheet = styled(BottomSheetRoot)(({ theme }) => ({
    '--rsbs-bg': theme.palette.mode === 'light' ? theme.palette.background.paper : blueGrey['900'],
    '--rsbs-handle-bg': theme.palette.divider,
    '--rsbs-overlay-rounded': `${theme.spacing(1.5)} !important`,
    [theme.breakpoints.up('sm')]: {
        '--rsbs-max-w': '400px',
        '--rsbs-ml': 'auto',
        '--rsbs-mr': theme.spacing(3)
    },
    '& [data-rsbs-header]': {
        height: theme.spacing(9),
        boxShadow: `0 1px 0 ${theme.palette.divider}`
    },
    '& [data-rsbs-scroll]': {
        overflow: 'hidden'
    }
}));

export interface BottomSheetHeaderToggleButtonProps extends LocalizationProps {
    expanded: boolean;
    setExpanded: (open: boolean) => void;
}

export const BottomSheetHeaderToggleButton = (
    {
        expanded,
        setExpanded,
        localization: { translations }
    }: BottomSheetHeaderToggleButtonProps
) => (
    <Tooltip title={!expanded ? translations.open : translations.close}>
        <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                transition: (theme) => theme.transitions.create('transform', {
                    duration: theme.transitions.duration.shortest
                }),
                transform: !expanded ? 'scale(1, -1)' : undefined
            }}
        >
            <ExpandMoreIcon />
        </IconButton>
    </Tooltip>
);

export const BottomSheetContent = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2)
}));

export const defaultSnapPoints = ({ maxHeight, minHeight, headerHeight }: SnapPointProps) => {
    const max = maxHeight - 8 * 9;
    return [minHeight >= max ? max : minHeight, headerHeight];
};
