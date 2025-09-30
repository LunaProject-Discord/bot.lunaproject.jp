'use client';

import { SnowflakePicker, SnowflakePickerItemProps, SnowflakePickerProps } from '@/components/picker';
import { LocalizationProps } from '@/interfaces/localization';
import { RedisRole } from '@/interfaces/redis';
import { filterPredicateRole, getRoleColor, sortRoles } from '@/utils/discord';
import { PickerItem, PickerItemIcon, PickerItemText } from '@lunaproject/web-core/dist/components/Picker';
import { SectionCardDisabledProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { Box } from '@mui/material';
import { APIRole } from 'discord-api-types/v10';
import deepmerge from 'lodash/merge';
import { size } from 'polished';
import React, { MouseEvent, useCallback } from 'react';

export type RolePickerType = (APIRole | RedisRole) & SectionCardDisabledProps;

export type RolePickerProps = Omit<SnowflakePickerProps<RolePickerType>, 'renderChoice' | 'filter'> & LocalizationProps;

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
        <PickerItem onClick={handleClick} selected={selected} disabled={role.disabled}>
            <PickerItemIcon>
                <Box sx={{ ...size(16), bgcolor: getRoleColor(role), borderRadius: '50%' }} />
            </PickerItemIcon>
            <PickerItemText primary={role.name} />
        </PickerItem>
    );
};

export const RolePicker = (
    {
        choices: _choices,
        onClick,
        slotProps,
        localization: { translations },
        ...props
    }: RolePickerProps
) => {
    const choices = sortRoles(_choices);

    const handleChoiceClick = useCallback((e: MouseEvent<HTMLElement>, role: RolePickerType, index: number) => {
        onClick?.(e, role, index);
    }, [onClick]);

    return (
        <SnowflakePicker
            renderChoice={RolePickerItem}
            choices={choices}
            onClick={handleChoiceClick}
            filter={filterPredicateRole}
            slotProps={
                deepmerge(
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
