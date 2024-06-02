'use client';

import { SnowflakePicker, SnowflakePickerItemProps, SnowflakePickerProps } from '@/components/picker';
import { DataGuild, RedisGuild } from '@/interfaces/redis';
import { getGuildIcon } from '@/utils/cdn';
import { filterPredicateGuild, sortGuilds } from '@/utils/discord';
import { SectionCardDisabledProps } from '@lunaproject/web-core/dist/components';
import { OAuthGuild } from '@lunaproject/web-discord/dist/interfaces';
import { Avatar, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import deepmerge from 'deepmerge';
import { APIGuild } from 'discord-api-types/v10';
import { ellipsis } from 'polished';
import React, { MouseEvent, useCallback } from 'react';

export type GuildPickerType = (OAuthGuild | APIGuild | RedisGuild | DataGuild) & SectionCardDisabledProps;

export type GuildPickerProps = Omit<SnowflakePickerProps<GuildPickerType>, 'renderChoice' | 'filter'>;

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
        <ListItemButton onClick={handleClick} selected={selected} disabled={guild.disabled}>
            <ListItemIcon sx={{ minWidth: 0 }}>
                <Avatar
                    src={getGuildIcon(guild)}
                    alt=" "
                    sx={{ width: 24, height: 24, pointerEvents: 'none' }}
                />
            </ListItemIcon>
            <ListItemText
                primary={guild.name}
                primaryTypographyProps={{ sx: { ...ellipsis(), display: 'block' } }}
            />
        </ListItemButton>
    );
};

export const GuildPicker = (
    {
        choices: _choices,
        onClick,
        slotProps,
        ...props
    }: GuildPickerProps
) => {
    const { translations } = props.localization;

    const choices = sortGuilds(_choices);

    const handleChoiceClick = useCallback((e: MouseEvent<HTMLDivElement>, guild: GuildPickerType, index: number) => {
        onClick?.(e, guild, index);
    }, [onClick]);

    return (
        <SnowflakePicker
            renderChoice={GuildPickerItem}
            choices={choices}
            onClick={handleChoiceClick}
            filter={filterPredicateGuild}
            slotProps={
                deepmerge<GuildPickerProps['slotProps']>(
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
