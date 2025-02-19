import { DataEmbed, DataMessage } from '@/interfaces/message';
import { MessageData, MessageEmbedData, rgbToDecimal } from '@lunaproject/web-discord-components';
import { hexToRgba } from '@uiw/react-color';
import { DateTime } from 'luxon';

export const toLPDMessage = (
    message: DataMessage,
    author: MessageData['author'] = {
        name: '結月 -ゆづき-',
        avatarUrl: '/avatars/yudzuki.webp',
        tag: {
            type: 'application',
            verified: true
        }
    }
): MessageData => ({
    timestamp: 'now',
    author,
    content: message.content ?? '',
    embeds: (message.embeds ?? []).map((embed) => toLPDMessageEmbed(embed))
});

export const toLPDMessageEmbed = (embed: DataEmbed): MessageEmbedData => {
    let timestamp = embed.timestamp ? DateTime.fromMillis(Number(embed.timestamp)) : undefined;
    if (!timestamp?.isValid)
        timestamp = undefined;

    return {
        title: embed.title ?? undefined,
        description: embed.description ?? undefined,
        url: embed.url ?? undefined,
        color: embed.color ? rgbToDecimal(hexToRgba(embed.color)) : undefined,
        timestamp,
        author: embed.author ? {
            name: embed.author.name,
            url: embed.author.url ?? undefined,
            iconUrl: embed.author.iconUrl ?? undefined
        } : undefined,
        footer: embed.footer ? {
            text: embed.footer.text,
            iconUrl: embed.footer.iconUrl ?? undefined
        } : undefined,
        fields: (embed.fields ?? []).map((field) => ({
            name: field.name,
            value: field.value,
            inline: field.inline ?? undefined
        })),
        images: embed.image?.images ?? undefined,
        thumbnail: embed.image?.thumbnail ?? undefined
    };
};
