'use client';

import { SnowflakePicker, SnowflakePickerItemProps, SnowflakePickerProps } from '@/components/picker';
import { LocalizationProps } from '@/interfaces/localization';
import { DataGuild, RedisGuild } from '@/interfaces/redis';
import { getGuildIcon } from '@/utils/cdn';
import { filterPredicateGuild, sortGuilds } from '@/utils/discord';
import { PickerItem, PickerItemIcon, PickerItemText } from '@lunaproject/web-core/dist/components/Picker';
import { SectionCardDisabledProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { OAuthGuild } from '@lunaproject/web-discord/dist/interfaces';
import { Avatar } from '@mui/material';
import { APIGuild } from 'discord-api-types/v10';
import deepmerge from 'lodash/merge';
import React, { MouseEvent, useCallback } from 'react';

export type GuildPickerType = (OAuthGuild | APIGuild | RedisGuild | DataGuild) & SectionCardDisabledProps;

export type GuildPickerProps =
    Omit<SnowflakePickerProps<GuildPickerType>, 'renderChoice' | 'filter'>
    & LocalizationProps;

export type GuildPickerItemProps = SnowflakePickerItemProps<GuildPickerType>;

export const GuildPickerItem = (
    {
        index,
        choice: guild,
        selected,
        onClick
    }: GuildPickerItemProps
) => {
    const handleClick = (e: MouseEvent<HTMLDivElement>) => onClick?.(e, guild, index);

    return (
        <PickerItem onClick={handleClick} selected={selected} disabled={guild.disabled}>
            <PickerItemIcon>
                <Avatar
                    src={getGuildIcon(guild)}
                    alt=" "
                    sx={{ width: 24, height: 24, pointerEvents: 'none' }}
                />
            </PickerItemIcon>
            <PickerItemText primary={guild.name} />
        </PickerItem>
    );
};

export const GuildPicker = (
    {
        choices: _choices,
        onClick,
        slotProps,
        localization: { translations },
        ...props
    }: GuildPickerProps
) => {
    const choices = sortGuilds(_choices);

    const handleChoiceClick = useCallback((e: MouseEvent<HTMLElement>, guild: GuildPickerType, index: number) => {
        onClick?.(e, guild, index);
    }, [onClick]);

    return (
        <SnowflakePicker
            renderChoice={GuildPickerItem}
            choices={choices}
            onClick={handleChoiceClick}
            filter={filterPredicateGuild}
            slotProps={
                deepmerge(
                    {
                        searchBox: {
                            placeholder: translations.search_guilds as string
                        }
                    },
                    slotProps ?? {}
                )
            }
            {...props}
        />
    );
};
