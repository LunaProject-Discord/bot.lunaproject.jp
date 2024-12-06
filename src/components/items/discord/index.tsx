'use client';

import { ArrowDropDownIcon, ArrowDropUpIcon, SearchIcon } from '@/components/icons';
import { PopoverProps } from '@/interfaces/mui';
import {
    Box,
    BoxProps,
    InputBase,
    InputBaseProps,
    List as MuiList,
    ListItemButton as MuiListItemButton,
    ListItemIcon as MuiListItemIcon,
    ListProps,
    ListSubheader as MuiListSubheader,
    styled,
    SxProps,
    Theme
} from '@mui/material';
import clsx from 'clsx';
import React, { forwardRef } from 'react';
import { ItemVariableProps } from '../index';

export interface SnowflakeItemProps<T> extends ItemVariableProps<string> {
    choices: T[];
}

interface SelectContainerProps {
    open?: boolean;
    disabled?: boolean;
}

const SelectRoot = styled(Box)<SelectContainerProps>(({ theme, open, disabled }) => ({
    height: 40,
    padding: theme.spacing('8.5px', 4, '8.5px', 1.75),
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    cursor: !disabled ? 'pointer' : 'default',
    userSelect: 'none',
    color: theme.vars.palette.text.disabled,
    ...(!disabled && {
        color: theme.vars.palette.text.primary,
        '&:hover div.select-outline': {
            borderColor: theme.vars.palette.text.primary
        },
        ...(open && {
            '& div.select-outline': {
                borderWidth: 2,
                borderColor: theme.vars.palette.primary.main
            }
        })
    })
}));

const SelectContent = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
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
    borderColor: 'rgb(0 0 0 / .23)',
    borderRadius: theme.shape.borderRadius,
    ...theme.applyStyles('dark', {
        borderColor: 'rgb(255 255 255 / .23)'
    })
}));

export interface SelectProps extends BoxProps {
    children?: React.ReactNode;
    open?: boolean;
    disabled?: boolean;
}

export interface SnowflakeSelectProps<T extends PopoverProps> {
    sx?: SxProps<Theme>;
    popoverProps?: T;
}

const Select = forwardRef<HTMLDivElement, SelectProps>((
    {
        open,
        onClick,
        disabled,
        children,
        ...props
    },
    ref
) => (
    <SelectRoot
        ref={ref}
        open={open}
        onClick={!disabled ? onClick : undefined}
        disabled={disabled}
        tabIndex={0}
        {...props}
    >
        <SelectContent>{children}</SelectContent>
        <Box
            sx={{
                position: 'absolute',
                right: 7,
                display: 'flex',
                color: !disabled ? 'action.active' : 'action.disabled'
            }}
        >
            {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </Box>
        <SelectOutline />
    </SelectRoot>
));
Select.displayName = 'Select';

export const ListRoot = styled(MuiList)(({ theme }) => ({
    height: 300,
    padding: theme.spacing(1),
    overflowY: 'auto',
    '& ul': {
        padding: 0
    }
}));

const List = forwardRef<HTMLUListElement, ListProps>(({ style, ...props }, ref) => (
    <ListRoot
        ref={ref}
        style={{
            ...style,
            height: parseFloat(style!.height as string) + (8 * 2)
        }}
        {...props}
    />
));
List.displayName = 'List';

export { Select, List };

export const ListItemButton = styled(MuiListItemButton)(({ theme }) => ({
    width: `calc(100% - calc(${theme.spacing(1)} * 2)) !important`,
    padding: theme.spacing(.5, 1),
    left: `${theme.spacing(1)} !important`,
    gap: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.down('sm')]: {
        minHeight: theme.spacing(6),
        padding: theme.spacing(.5, 1.5),
        gap: theme.spacing(1.5)
    }
}));

export const ListItemIcon = styled(MuiListItemIcon)(({ theme }) => ({
    minWidth: theme.spacing(3)
}));

export const ListSubheader = styled(MuiListSubheader)(({ theme }) => ({
    padding: theme.spacing(1, 1, .5),
    lineHeight: 'unset',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    backgroundImage: 'none',
    ...theme.applyStyles('dark', {
        backgroundImage: theme.vars.overlays[8]
    }),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1, 1.5, .5)
    }
}));

export const SearchBox = (props: InputBaseProps) => (
    <Box
        sx={(theme) => ({
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            bgcolor: theme.vars.palette.grey[100],
            ...theme.applyStyles('dark', {
                bgcolor: theme.vars.palette.grey[900]
            })
        })}
    >
        <SearchIcon color="action" />
        <InputBase {...props} fullWidth />
    </Box>
);

export * from './channel';
export * from './role';
export * from './member';
export * from './message';
