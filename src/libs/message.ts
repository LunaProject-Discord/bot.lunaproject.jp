import { DataEmbed, DataMessage } from '@interfaces/message';
import { Embed, Message, MessageAuthor } from '@lunaproject-discord/web-discord';
import Color from 'color';
import { nanoid } from 'nanoid';

export const toMessage = (
    message: DataMessage,
    author: MessageAuthor = {
        name: '結月 -ゆづき-',
        avatarUrl: '/avatars/yudzuki.webp',
        badge: 'Bot'
    }
): Message => ({
    content: message.content ?? '',
    attachments: [],
    embeds: (message.embeds ?? []).map((embed) => toEmbed(embed)),
    author: author,
    timestamp: new Date()
});

export const toEmbed = (
    {
        title,
        description,
        url,
        color,
        timestamp,
        author,
        fields,
        image,
        footer
    }: DataEmbed
): Embed => {
    const date = new Date();
    date.setTime(parseInt(timestamp ?? Date.now().toString(), 10));

    return {
        _id: nanoid(),
        title,
        description,
        url: url ?? '',
        color: Color(color ?? 0xffffff),
        timestamp: timestamp ? date : null,
        author: {
            name: author?.name ?? '',
            url: author?.url ?? '',
            iconUrl: author?.iconUrl ?? ''
        },
        fields: (fields ?? []).map((field) => ({
            name: field.name,
            value: field.value,
            inline: field.inline ?? false
        })),
        image: {
            images: image?.images ?? [],
            thumbnail: image?.thumbnail ?? ''
        },
        footer: {
            text: footer?.text ?? '',
            iconUrl: footer?.iconUrl ?? ''
        }
    };
};

export const getNewEmbed = (): Embed => ({
    _id: nanoid(),
    title: '',
    description: '',
    url: '',
    color: Color(0xffffff),
    timestamp: null,
    author: {
        name: '',
        url: '',
        iconUrl: ''
    },
    fields: [],
    image: {
        images: [],
        thumbnail: ''
    },
    footer: {
        text: '',
        iconUrl: ''
    }
});

export const toDataMessage = (message: Message): DataMessage => ({
    content: message.content,
    embeds: message.embeds.map((embed) => toDataEmbed(embed))
});

export const toDataEmbed = (
    {
        title,
        description,
        url,
        color,
        timestamp,
        author,
        fields,
        image,
        footer
    }: Embed
): DataEmbed => ({
    title,
    description,
    url: parseUrl(url),
    color: color.hex(),
    timestamp: timestamp?.getTime()?.toString() ?? null,
    author: author != null && author.name.length > 0 ? {
        name: author.name,
        url: parseUrl(author.url),
        iconUrl: parseUrl(author.iconUrl)
    } : null,
    fields: fields.map((field) => ({
        name: field.name,
        value: field.value,
        inline: field.inline
    })),
    image: image != null && (image.images.length > 0 || parseUrl(image.thumbnail) !== null) ? {
        images: image.images,
        thumbnail: parseUrl(image.thumbnail)
    } : null,
    footer: footer != null && footer.text.length > 0 ? {
        text: footer.text,
        iconUrl: parseUrl(footer.iconUrl)
    } : null
});

const parseUrl = (value: string) => {
    if (value.length < 1)
        return null;
    try {
        new URL(value);
        return value;
    } catch {
        return null;
    }
};
