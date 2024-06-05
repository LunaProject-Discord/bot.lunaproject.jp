'use client';

import { Code } from '@/components/text';
import { DataGuild, RedisGuild, RedisMember, RedisSnowflake, RedisUser } from '@/interfaces/redis';
import { buildCdnUrl, getMemberAvatar, getUserAvatar } from '@/utils/cdn';
import { getUserDisplayName } from '@/utils/discord';
import { GuildMember, OAuthGuild, OAuthUser } from '@lunaproject/web-discord/dist/interfaces';
import { Box } from '@mui/material';
import { APIGuild, APIUser } from 'discord-api-types/v10';
import React, { Fragment, ReactNode } from 'react';

export const getFallbackUserDisplay = (user: OAuthUser | APIUser | RedisUser, color: 'primary' | 'secondary'): ReactNode => {
    const name = 'username' in user ? user.username : user.name;
    const isTransferCompleted = Number(user.discriminator) === 0;

    if (isTransferCompleted) {
        return (<Box component="span" sx={{ color: `text.${color}` }}>@{name}</Box>);
    } else {
        return (
            <Fragment>
                <Box component="span" sx={{ color: 'text.primary' }}>{name}</Box>
                <Box component="span" sx={{ fontFamily: 'Renner', color: 'text.secondary' }}>
                    #{user.discriminator}
                </Box>
            </Fragment>
        );
    }
};


export const getUserDisplay = (user: OAuthUser | APIUser | RedisUser): [ReactNode, ReactNode] => {
    const name = 'username' in user ? user.username : user.name;
    const displayName = ('username' in user ? user.global_name : user.display_name) ?? undefined;
    const isTransferCompleted = Number(user.discriminator) === 0;

    const primaryFallback = getFallbackUserDisplay(user, 'primary');
    const secondaryFallback = getFallbackUserDisplay(user, 'secondary');

    if (isTransferCompleted) {
        return [getUserDisplayName(user), secondaryFallback];
    } else {
        const isVisibleDisplayName = displayName !== undefined && displayName !== name;
        return [isVisibleDisplayName ? displayName : primaryFallback, isVisibleDisplayName ? secondaryFallback : undefined];
    }
};

export const getMemberDisplay = (member: GuildMember | RedisMember): [ReactNode, ReactNode] => {
    const nick = member.nick ?? undefined;
    return nick ? [nick, getFallbackUserDisplay(member.user, 'secondary')] : getUserDisplay(member.user);
};

const isSnowflakeOnly = (user: OAuthUser | APIUser | RedisSnowflake | RedisUser): user is RedisSnowflake => {
    return Object.keys(user).length === 1 && 'id' in user;
};

export const getProfileDisplay = (
    user: OAuthUser | APIUser | RedisSnowflake | RedisUser,
    member?: GuildMember | RedisMember,
    guild?: OAuthGuild | APIGuild | RedisGuild | DataGuild
): [string, ReactNode, ReactNode] => {
    if (isSnowflakeOnly(user)) {
        return [
            buildCdnUrl('/embed/avatars/0', undefined, 'png'),
            (<Code key={user.id}>{user.id}</Code>),
            undefined
        ];
    }

    if (member) {
        const [primary, secondary] = getMemberDisplay(member);
        return [
            guild ? getMemberAvatar(member, guild) : getUserAvatar(user),
            primary,
            secondary
        ];
    }
    const [primary, secondary] = getUserDisplay(user);
    return [getUserAvatar(user), primary, secondary];
};
