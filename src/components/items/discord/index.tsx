'use client';

import { ArrowDropDownOutlined, ArrowDropUpOutlined, SearchOutlined } from '@mui/icons-material';
import {
    alpha,
    Box,
    BoxProps,
    getOverlayAlpha,
    InputBase,
    InputBaseProps,
    List as MuiList,
    ListItemButton as MuiListItemButton,
    ListItemIcon as MuiListItemIcon,
    ListSubheader as MuiListSubheader,
    styled
} from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { ItemVariableProps } from '../index';

export interface SnowflakeItemProps<T> extends ItemVariableProps<string> {
    choices: T[];
}

interface SelectContainerProps {
    open?: boolean;
    disabled?: boolean;
}

const SelectContainer = styled(Box)<SelectContainerProps>(({ theme, open, disabled }) => ({
    height: 40,
    padding: theme.spacing('8.5px', 4, '8.5px', 1.75),
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    cursor: !disabled ? 'pointer' : 'default',
    color: !disabled ? theme.palette.text.primary : theme.palette.text.disabled,
    ...(!disabled && {
        '&:hover div.select-outline': {
            borderColor: theme.palette.text.primary
        },
        ...(open && {
            '& div.select-outline': {
                borderWidth: 2,
                borderColor: theme.palette.primary.main
            }
        })
    })
}));

const SelectContent = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(.5),
    overflow: 'hidden',
    '& .MuiTypography-root': {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
    }
}));

const SelectOutline = styled(
    ({ className, ...props }: BoxProps) => <Box {...props} className={clsx(className, 'select-outline')} />
)<BoxProps>(({ theme }) => ({
    minWidth: '0%',
    padding: theme.spacing(0, 1),
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)',
    borderRadius: theme.shape.borderRadius
}));

export interface SelectProps extends BoxProps {
    children?: React.ReactNode;
    open?: boolean;
    disabled?: boolean;
}

export const Select = ({ children, open, disabled, onClick, ...props }: SelectProps) => (
    <SelectContainer open={open} disabled={disabled} tabIndex={0} onClick={!disabled ? onClick : undefined} {...props}>
        <SelectContent>{children}</SelectContent>
        <Box
            sx={{
                position: 'absolute',
                right: 7,
                display: 'flex',
                color: !disabled ? 'action.active' : 'action.disabled'
            }}
        >
            {open ? <ArrowDropUpOutlined /> : <ArrowDropDownOutlined />}
        </Box>
        <SelectOutline />
    </SelectContainer>
);

export const List = styled(MuiList)({
    height: 300,
    ['overflowY' as any]: 'overlay',
    '& ul': {
        padding: 0
    }
});

export const ListItemButton = styled(MuiListItemButton)(({ theme }) => ({
    padding: theme.spacing(.5, 3, .5, 1.5),
    gap: theme.spacing(1.5)
}));

export const ListItemIcon = styled(MuiListItemIcon)(({ theme }) => ({
    minWidth: theme.spacing(3)
}));

export const ListSubheader = styled(MuiListSubheader)(({ theme }) => ({
    padding: theme.spacing(1, 1.5, .5),
    lineHeight: 'unset',
    backgroundImage: theme.palette.mode === 'dark' ? `linear-gradient(${alpha(
        '#fff',
        Number(getOverlayAlpha(8))
    )}, ${alpha(
        '#fff',
        Number(getOverlayAlpha(8))
    )})` : 'none'
}));

export const SearchBox = (props: InputBaseProps) => (
    <Box
        sx={{
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            bgcolor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900]
        }}
    >
        <SearchOutlined color="action" />
        <InputBase {...props} fullWidth />
    </Box>
);

export * from './channel';
export * from './role';
export * from './message';
