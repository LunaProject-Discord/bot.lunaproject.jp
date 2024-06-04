'use client';

import { SnowflakePicker, SnowflakePickerItemProps, SnowflakePickerProps } from '@/components/picker';
import { RedisRole } from '@/interfaces/redis';
import { filterPredicateRole, getRoleColor, sortRoles } from '@/utils/discord';
import { SectionCardDisabledProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { Box, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import deepmerge from 'deepmerge';
import { APIRole } from 'discord-api-types/v10';
import { ellipsis, size } from 'polished';
import React, { MouseEvent, useCallback } from 'react';

export type RolePickerType = (APIRole | RedisRole) & SectionCardDisabledProps;

export type RolePickerProps = Omit<SnowflakePickerProps<RolePickerType>, 'renderChoice' | 'filter'>;

export type RolePickerItemProps = SnowflakePickerItemProps<RolePickerType>;

export const RolePickerItem = (
    {
        index,
        choice: role,
        selected,
        onClick
    }: RolePickerItemProps
) => {
    const handleClick = (e: MouseEvent<HTMLDivElement>) => onClick?.(e, role, index);

    return (
        <ListItemButton onClick={handleClick} selected={selected} disabled={role.disabled}>
            <ListItemIcon sx={{ minWidth: 0 }}>
                <Box sx={{ ...size(16), bgcolor: getRoleColor(role), borderRadius: '50%' }} />
            </ListItemIcon>
            <ListItemText
                primary={role.name}
                primaryTypographyProps={{ sx: { ...ellipsis(), display: 'block' } }}
            />
        </ListItemButton>
    );
};

export const RolePicker = (
    {
        choices: _choices,
        onClick,
        slotProps,
        ...props
    }: RolePickerProps
) => {
    const { translations } = props.localization;

    const choices = sortRoles(_choices);

    const handleChoiceClick = useCallback((e: MouseEvent<HTMLDivElement>, role: RolePickerType, index: number) => {
        onClick?.(e, role, index);
    }, [onClick]);

    return (
        <SnowflakePicker
            renderChoice={RolePickerItem}
            choices={choices}
            onClick={handleChoiceClick}
            filter={filterPredicateRole}
            slotProps={
                deepmerge<RolePickerProps['slotProps']>(
                    {
                        searchBox: {
                            placeholder: translations.search_roles as string
                        }
                    },
                    slotProps ?? {}
                )
            }
            {...props}
        />
    );
};
