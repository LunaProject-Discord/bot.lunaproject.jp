import Color from 'color';
import { nanoid } from 'nanoid';
import {
    EditableEmbed,
    EditableEmbedField,
    EditableMessage,
    EditableMessageAuthor,
    SendableEmbed,
    SendableMessage
} from '../interfaces/message';

const MAX_FIELDS_PER_ROW = 3;
const FIELD_GRID_SIZE = 12;

export const getFieldGridColumn = (field: EditableEmbedField, embed: EditableEmbed): string => {
    const fields = embed.fields ?? [];
    const fieldIndex = fields.indexOf(field);

    if (!field.inline)
        return `1 / ${FIELD_GRID_SIZE + 1}`;

    let startingField = fieldIndex;
    while (startingField > 0 && fields[startingField - 1].inline)
        startingField -= 1;

    let totalInlineFields = 0;
    while (fields.length > startingField + totalInlineFields && fields[startingField + totalInlineFields].inline)
        totalInlineFields += 1;

    const indexInSequence = fieldIndex - startingField;
    const currentRow = indexInSequence / MAX_FIELDS_PER_ROW;
    const indexOnRow = indexInSequence % MAX_FIELDS_PER_ROW;
    const totalOnLastRow = totalInlineFields % MAX_FIELDS_PER_ROW || MAX_FIELDS_PER_ROW;
    const fullRows = (totalInlineFields - totalOnLastRow) / MAX_FIELDS_PER_ROW;
    const totalOnRow = currentRow >= fullRows ? totalOnLastRow : MAX_FIELDS_PER_ROW;

    const columnSpan = FIELD_GRID_SIZE / totalOnRow;
    const start = indexOnRow * columnSpan + 1;
    const end = start + columnSpan;

    return `${start} / ${end}`;
};

export const toEditableMessage = (
    message: SendableMessage,
    author: EditableMessageAuthor = {
        name: '結月 -ゆづき-',
        avatarUrl: '/avatars/yudzuki.webp',
        badge: 'Bot'
    }
): EditableMessage => ({
    content: message.content ?? '',
    attachments: [],
    embeds: (message.embeds ?? []).map((embed) => toEditableEmbed(embed)),
    author: author,
    timestamp: new Date()
});

export const toSendableMessage = (message: EditableMessage): SendableMessage => ({
    content: message.content,
    embeds: message.embeds.map((embed) => toSendableEmbed(embed))
});

export const getNewEmbed = (): EditableEmbed => ({
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

export const toEditableEmbed = (
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
    }: SendableEmbed
): EditableEmbed => {
    const date = new Date();
    date.setTime(parseInt(timestamp ?? Date.now().toString(), 10));

    return {
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

export const toSendableEmbed = (
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
    }: EditableEmbed
): SendableEmbed => ({
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
