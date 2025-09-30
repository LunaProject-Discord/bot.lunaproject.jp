'use client';

import { generateComponentClasses } from '@lunaproject/web-discord-components/dist/utils';
import {
    Box,
    BoxProps,
    CSSObject,
    ListItemButton as MuiListItemButton,
    ListItemIcon as MuiListItemIcon,
    styled,
    SxProps,
    Theme
} from '@mui/material';
import clsx from 'clsx';

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


export const sectionItemClasses = generateComponentClasses(
    'SectionItem',
    [
        'root',
        'buttonRoot',
        'rowContainer',
        'formContainer',

        'disabled'
    ]
);

export const itemRootStyled = (theme: Theme): CSSObject => ({
    padding: theme.spacing(0, 1.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'stretch',
    gap: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color', 'color'], {
        duration: theme.transitions.duration.shortest
    }),
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center'
    }
});

export interface ItemRootProps {
    className?: string;
    sx?: SxProps<Theme>;
}

export const ItemRoot = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            className={clsx(sectionItemClasses.root, className)}
            {...props}
        />
    )
)<BoxProps>(({ theme }) => itemRootStyled(theme));

export interface ItemRowContainerProps extends BoxProps {
    dense?: boolean;
}

export const ItemRowContainer = styled(
    ({ className, ...props }: ItemRowContainerProps) => (
        <Box
            className={clsx(sectionItemClasses.rowContainer, className)}
            {...props}
        />
    ),
    { shouldForwardProp: (prop) => prop !== 'sx' && prop !== 'dense' }
)<ItemRowContainerProps>(({ theme, dense = false }) => ({
    width: '100%',
    minHeight: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: theme.spacing(1.5),
    [theme.breakpoints.down('md')]: {
        marginBottom: dense ? theme.spacing(-2.5) : 0,
        [`& + .${sectionItemClasses.formContainer}`]: {
            width: '100%'
        }
    }
}));

export const ItemFormContainer = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            className={clsx(sectionItemClasses.formContainer, className)}
            {...props}
        />
    )
)<BoxProps>(({ theme }) => ({
    height: 50,
    display: 'flex',
    flexShrink: 0,
    placeItems: 'center',
    placeContent: 'center',
    gap: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
        padding: 0
    }
}));
