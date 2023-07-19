'use client';

import { RedisMember, RedisUser } from '@interfaces/redis';
import { GuildMember, OAuthUser } from '@lunaproject-discord/web-discord/dist/interfaces/discord';
import { Box } from '@mui/material';
import { getUserDisplayName } from '@utils/discord';
import { APIUser } from 'discord-api-types/v10';
import { Fragment, ReactNode } from 'react';

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
