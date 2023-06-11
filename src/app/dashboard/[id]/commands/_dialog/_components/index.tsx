import {
    DefaultEditableItem as OriginalDefaultEditableItem,
    DefaultEditableItemProps,
    EditableItem as OriginalEditableItem,
    EditableItemProps
} from '@app/dashboard/[id]/commands/_components';
import { StyledProps } from '@interfaces/mui';
import { styled, Typography } from '@mui/material';
import React from 'react';

export const Group = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(.5)
}));

export const GroupTitle = styled(Typography)(({ theme }) => ({
    minHeight: 30,
    paddingBottom: theme.spacing(.5),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(.5),
    borderBottom: `solid 1px ${theme.palette.divider}`
}));

export const DefaultEditableItem = (
    {
        value,
        setValue,
        disabled,
        children
    }: Exclude<DefaultEditableItemProps, keyof StyledProps>
) => (
    <OriginalDefaultEditableItem value={value} setValue={setValue} disabled={disabled} sx={{ p: 0 }}>
        {children}
    </OriginalDefaultEditableItem>
);

export const EditableItem = (
    {
        value,
        setValue,
        disabled,
        children,
        localization
    }: Exclude<EditableItemProps, keyof StyledProps>
) => (
    <OriginalEditableItem
        value={value}
        setValue={setValue}
        disabled={disabled}
        localization={localization}
        sx={{ p: 0 }}
    >
        {children}
    </OriginalEditableItem>
);

export * from './channels';
export * from './roles';
export * from './members';
