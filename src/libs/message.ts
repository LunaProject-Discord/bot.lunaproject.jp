import { MessageData, MessageEmbedData } from '@/interfaces/message';
import {
    MessageData as LPDMessageData,
    MessageEmbedData as LPDMessageEmbedData
} from '@lunaproject/web-discord-components';
import { DateTime } from 'luxon';

export const toLPDMessage = (
    message: MessageData,
    author: LPDMessageData['author'] = {
        name: '結月 -ゆづき-',
        avatarUrl: '/avatars/yudzuki.webp',
        tag: {
            type: 'application',
            verified: true
        }
    }
): LPDMessageData => ({
    timestamp: 'now',
    author,
    content: message.content ?? '',
    embeds: (message.embeds ?? []).map((embed) => toLPDMessageEmbed(embed))
});

export const toLPDMessageEmbed = (embed: MessageEmbedData): LPDMessageEmbedData => {
    let timestamp: DateTime<true | false> | undefined;
    switch (embed.timestamp?.type) {
        case 'value':
            timestamp = DateTime.fromSeconds(embed.timestamp.value);
            break;
        case 'now':
            timestamp = DateTime.now();
            break;
        default:
            timestamp = undefined;
            break;
    }

    if (!timestamp?.isValid)
        timestamp = undefined;

    return {
        title: embed.title ?? undefined,
        description: embed.description ?? undefined,
        url: embed.url ?? undefined,
        color: embed.color ?? undefined,
        timestamp,
        author: embed.author.name.length > 0 ? {
            name: embed.author.name,
            url: embed.author.url ?? undefined,
            iconUrl: embed.author.icon_url ?? undefined
        } : undefined,
        footer: embed.footer.text.length > 0 ? {
            text: embed.footer.text,
            iconUrl: embed.footer.icon_url ?? undefined
        } : undefined,
        fields: (embed.fields ?? []).map((field) => ({
            name: field.name,
            value: field.value,
            inline: field.inline ?? undefined
        })),
        images: embed.image ? [embed.image] : undefined,
        thumbnail: embed.thumbnail ?? undefined
    };
};
