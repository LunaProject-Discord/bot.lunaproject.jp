'use client';

import { GuildConfigurationViewProps, UserViewProps } from '@/interfaces/view';
import { getMemberAvatar, getUserAvatar } from '@/utils/cdn';
import { getRoleColor, getUserDisplayName } from '@/utils/discord';
import { PageHeader } from '@lunaproject/web-core/dist/components/Layout';
import { Section, SectionContent } from '@lunaproject/web-core/dist/components/Section';
import { ChannelType as LPDChannelType, Message, Messages, UserTag } from '@lunaproject/web-discord-components';
import { ChannelType } from 'discord-api-types/v10';
import { DateTime } from 'luxon';
import React, { Fragment } from 'react';

type ViewProps = UserViewProps & GuildConfigurationViewProps;

export const View = ({ user, guild, configuration, localization }: ViewProps) => {
    const { translations } = localization;

    return (
        <Fragment>
            <PageHeader primary={translations.vote} secondary={translations.vote_description} />
            <Section>
                <SectionContent>
                    <Messages
                        channels={guild.channels.map((channel) => {
                            let type: LPDChannelType;

                            switch (channel.type) {
                                case ChannelType.GuildVoice:
                                    type = 'voice';
                                    break;
                                case ChannelType.GuildStageVoice:
                                    type = 'stage';
                                    break;
                                case ChannelType.GuildForum:
                                    type = 'forum';
                                    break;
                                case ChannelType.AnnouncementThread:
                                case ChannelType.PublicThread:
                                case ChannelType.PrivateThread:
                                case ChannelType.GuildNewsThread:
                                case ChannelType.GuildPublicThread:
                                case ChannelType.GuildPrivateThread:
                                    type = 'thread';
                                    break;
                                default:
                                    type = 'text';
                                    break;
                            }

                            return {
                                id: channel.id,
                                name: channel.name,
                                type
                            };
                        })}
                        roles={guild.roles.map((role) => ({
                            id: role.id,
                            name: role.name,
                            color: getRoleColor(role) ?? undefined,
                            icon: role.icon ?? undefined
                        }))}
                        users={guild.members.map((member) => {
                            let tag: UserTag | undefined = undefined;

                            if (member.user.system)
                                tag = { type: 'system' };
                            if (member.user.bot)
                                tag = { type: 'application' };

                            return {
                                id: member.id,
                                name: member.nick ?? member.user.display_name ?? member.user.name,
                                avatarUrl: getMemberAvatar(member, guild),
                                tag
                            };
                        })}
                    >
                        <Message
                            message={{
                                timestamp: DateTime.now().minus({ minute: 1 }),
                                author: {
                                    name: getUserDisplayName(user),
                                    avatarUrl: getUserAvatar(user)
                                },
                                content: '#.help'
                            }}
                        />
                        <Message
                            message={{
                                timestamp: 'now',
                                reply: {
                                    user: {
                                        name: getUserDisplayName(user),
                                        avatarUrl: getUserAvatar(user)
                                    },
                                    type: 'message',
                                    content: '#.help'
                                },
                                author: {
                                    name: '結月 -ゆづき-',
                                    avatarUrl: '/avatars/yudzuki.webp',
                                    tag: {
                                        type: 'application',
                                        verified: true
                                    }
                                },
                                content: '@everyone <@508919483440693294> <@&1132679376815796264> <#750738487640195203> <#1059429292330733618> <#1047148695247917056> **Hello** *world*!\n' +
                                    '\n' +
                                    '> # :thinking: 🤔 Test\n' +
                                    '## Test\n' +
                                    '### Test\n' +
                                    '- Test\n' +
                                    '  - Test\n' +
                                    '\n' +
                                    '* Test\n' +
                                    '  * Test\n' +
                                    '\n' +
                                    '1. Test\n' +
                                    '2. Test\n' +
                                    '  3. Test\n' +
                                    '\n' +
                                    '> Test\n' +
                                    '\n' +
                                    '<t:0:f>\n' +
                                    '<t:0:F>\n' +
                                    '<t:0:d>\n' +
                                    '<t:0:D>\n' +
                                    '<t:0:t>\n' +
                                    '<t:0:T>\n' +
                                    '<t:0:R>\n' +
                                    '\n' +
                                    ':thumbsup:\n' +
                                    '\n' +
                                    '```Code block```' +
                                    '\n' +
                                    '-# https://www.youtube.com/watch?v=5HTPLCcXBJA',
                                embeds: [
                                    {
                                        title: 'レベル情報',
                                        description: 'Test',
                                        color: 9804480,
                                        timestamp: 'now',
                                        author: {
                                            name: 'テスト',
                                            iconUrl: 'https://yt3.ggpht.com/040z4ufe2-wsa0_Myus515goYWR9mRm0gLW393iLmZQhGXFdcV4mlLdBR1mBRhz4YFrF2hA6Kw8=s88-c-k-c0x00ffffff-no-rj'
                                        },
                                        footer: {
                                            text: 'Page 1 / 1',
                                            iconUrl: 'https://images-ext-1.discordapp.net/external/Snmt6fSL3kmTVzSITbH0WJNpLirwAOO47mpNz_p5_KY/https/cdn.discordapp.com/icons/567219722458890271/a69de7822678b05067f17f58330f47d8.png'
                                        },
                                        fields: [
                                            {
                                                name: '暫定順位',
                                                value: '{rank:new}',
                                                inline: true
                                            },
                                            {
                                                name: 'レベル',
                                                value: '{level:new}',
                                                inline: true
                                            },
                                            {
                                                name: '経験値 (最大)',
                                                value: '{xp:new} ({max_xp:new})',
                                                inline: true
                                            }
                                        ],
                                        images: [
                                            'https://img.youtube.com/vi/vDl2UpkxaVM/maxresdefault.jpg'
                                        ],
                                        thumbnail: 'https://img.youtube.com/vi/vDl2UpkxaVM/maxresdefault.jpg'
                                    }
                                ]
                            }}
                        />
                    </Messages>
                </SectionContent>
            </Section>
        </Fragment>
    );
};
