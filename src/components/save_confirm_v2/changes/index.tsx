import { UndoIcon } from '@/components/icons';
import { ChangeAdd } from '@/components/save_confirm_v2/changes/add';
import { ChangeRemove } from '@/components/save_confirm_v2/changes/remove';
import { ChangeUpdate } from '@/components/save_confirm_v2/changes/update';
import { Change, ChangesGroupByPath, groupByChanges, mapChanges } from '@/components/save_confirm_v2/changes/utils';
import { Code } from '@/components/text';
import { LocalizationProps } from '@/interfaces/localization';
import { Box, BoxProps, styled, Tooltip, Typography } from '@mui/material';
import clsx from 'clsx';
import { IChange } from 'json-diff-ts';
import React from 'react';

export const changesClasses = {
    root: 'Changes-root'
};

export const changeClasses = {
    root: 'Change-root',
    groupRoot: 'Change-groupRoot',

    iconRoot: 'Change-iconRoot',
    icon: 'Change-icon',
    undoButton: 'Change-undoButton'
};

export const ChangesRoot = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            className={clsx(changesClasses.root, className)}
            {...props}
        />
    )
)<BoxProps>(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(.5)
}));

export const ChangeGroupRoot = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            className={clsx(changeClasses.groupRoot, className)}
            {...props}
        />
    )
)<BoxProps>(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    [`& .${changeClasses.root}:not(:first-child)`]: {
        padding: theme.spacing(0, 2)
    }
}));

export const ChangeRoot = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            className={clsx(changeClasses.root, className)}
            {...props}
        />
    )
)<BoxProps>(({ theme }) => ({
    margin: theme.spacing(0, -2),
    padding: theme.spacing(.5, 2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color', 'color'], {
        duration: theme.transitions.duration.shortest
    }),
    '&:hover': {
        backgroundColor: theme.vars.palette.action.hover,
        [`& .${changeClasses.icon}`]: {
            visibility: 'hidden'
        },
        [`& .${changeClasses.undoButton}`]: {
            visibility: 'visible'
        }
    }
}));

export const ChangeIconRoot = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            className={clsx(changeClasses.iconRoot, className)}
            {...props}
        />
    )
)<BoxProps>({
    position: 'relative'
});

export const ChangeUndoButtonRoot = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            className={clsx(changeClasses.undoButton, className)}
            {...props}
        />
    )
)<BoxProps>(({ theme }) => ({
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    visibility: 'hidden',
    cursor: 'pointer',
    color: theme.vars.palette.action.active,
    '&:hover': {
        color: theme.vars.palette.text.primary
    }
}));

export interface ChangeUndoButtonProps extends LocalizationProps {

}

export const ChangeUndoButton = ({ localization: { translations } }: ChangeUndoButtonProps) => (
    <ChangeUndoButtonRoot>
        <Tooltip title={translations.undo}>
            <Box component="span" sx={{ display: 'flex' }}>
                <UndoIcon fontSize="small" color="inherit" />
            </Box>
        </Tooltip>
    </ChangeUndoButtonRoot>
);

export const ChangeIconSpacer = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            className={clsx(changeClasses.icon, className)}
            {...props}
        />
    )
)<BoxProps>(({ theme }) => ({
    width: theme.spacing(2.5),
    aspectRatio: '1'
}));

export const ChangeCode = styled(Code)(({ theme }) => ({
    padding: theme.spacing(0, .5)
}));

export interface ChangeGroupProps extends LocalizationProps {
    path: string;
    changes: Change[];
}

export interface ChangesProps extends LocalizationProps {
    changes: IChange[];
    groupByPath?: (changes: Change[] | undefined) => ChangesGroupByPath;
}

export const Changes = ({ changes, groupByPath, localization }: ChangesProps) => {
    const { translations } = localization;

    const groupedChanges = groupByChanges(changes, groupByPath);

    return (
        <ChangesRoot>
            <Typography variant="h4" fontWeight={400}>
                {String(translations.save_confirm_changes).replace('%c', mapChanges(changes).length.toLocaleString())}
            </Typography>
            {Object.entries(groupedChanges.add).map(([path, changes]) => (
                <ChangeAdd
                    key={path}
                    path={path}
                    changes={changes}
                    localization={localization}
                />
            ))}
            {Object.entries(groupedChanges.remove).map(([path, changes]) => (
                <ChangeRemove
                    key={path}
                    path={path}
                    changes={changes}
                    localization={localization}
                />
            ))}
            {Object.entries(groupedChanges.update).map(([path, changes]) => (
                <ChangeUpdate
                    key={path}
                    path={path}
                    changes={changes}
                    localization={localization}
                />
            ))}
        </ChangesRoot>
    );
};
