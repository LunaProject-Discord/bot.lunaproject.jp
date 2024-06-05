'use client';

import {
    PickerItemIcon,
    PickerItemText,
    SnowflakePicker,
    SnowflakePickerItemProps,
    SnowflakePickerProps
} from '@/components/picker';
import { RedisRole } from '@/interfaces/redis';
import { filterPredicateRole, getRoleColor, sortRoles } from '@/utils/discord';
import { SectionCardDisabledProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { Box, ListItemButton } from '@mui/material';
import deepmerge from 'deepmerge';
import { APIRole } from 'discord-api-types/v10';
import { size } from 'polished';
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
            <PickerItemIcon>
                <Box sx={{ ...size(16), bgcolor: getRoleColor(role), borderRadius: '50%' }} />
            </PickerItemIcon>
            <PickerItemText primary={role.name} />
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
