'use client';

import { SnowflakePicker, SnowflakePickerItemProps, SnowflakePickerProps } from '@/components/picker';
import { RedisMember } from '@/interfaces/redis';
import { getMemberAvatar, getUserAvatar } from '@/utils/cdn';
import { filterPredicateMember, getMemberDisplayName, sortMembers } from '@/utils/discord';
import { SectionCardDisabledProps } from '@lunaproject/web-core/dist/components';
import { GuildMember } from '@lunaproject/web-discord/dist/interfaces';
import { Avatar, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import deepmerge from 'deepmerge';
import { ellipsis } from 'polished';
import React, { MouseEvent, useCallback } from 'react';

export type MemberPickerType = (GuildMember | RedisMember) & SectionCardDisabledProps;

export type MemberPickerProps = Omit<SnowflakePickerProps<MemberPickerType>, 'renderChoice' | 'filter'>;

export type MemberPickerItemProps = SnowflakePickerItemProps<MemberPickerType>;

export const MemberPickerItem = (
    {
        index,
        choice: member,
        selected,
        onClick
    }: MemberPickerItemProps
) => {
    const handleClick = (e: MouseEvent<HTMLDivElement>) => onClick?.(e, member, index);

    return (
        <ListItemButton onClick={handleClick} selected={selected} disabled={member.disabled}>
            <ListItemIcon sx={{ minWidth: 0 }}>
                <Avatar
                    src={'guild_id' in member ? getMemberAvatar(member, member.guild_id) : getUserAvatar(member.user)}
                    alt=" "
                    sx={{ width: 24, height: 24, pointerEvents: 'none' }}
                />
            </ListItemIcon>
            <ListItemText
                primary={getMemberDisplayName(member)}
                primaryTypographyProps={{ sx: { ...ellipsis(), display: 'block' } }}
            />
        </ListItemButton>
    );
};

export const MemberPicker = (
    {
        choices: _choices,
        onClick,
        slotProps,
        ...props
    }: MemberPickerProps
) => {
    const { translations } = props.localization;

    const choices = sortMembers(_choices);

    const handleChoiceClick = useCallback((e: MouseEvent<HTMLDivElement>, member: MemberPickerType, index: number) => {
        onClick?.(e, member, index);
    }, [onClick]);

    return (
        <SnowflakePicker
            renderChoice={MemberPickerItem}
            choices={choices}
            onClick={handleChoiceClick}
            filter={filterPredicateMember}
            slotProps={
                deepmerge<MemberPickerProps['slotProps']>(
                    {
                        searchBox: {
                            placeholder: translations.search_members as string
                        }
                    },
                    slotProps ?? {}
                )
            }
            {...props}
        />
    );
};
