import Color from 'color';

export interface EditableMessage {
    content: string;
    attachments: File[];
    embeds: EditableEmbed[];
    author: EditableMessageAuthor;
    timestamp: Date;
}

export interface EditableMessageAuthor {
    name: string;
    avatarUrl: string;
    badge?: string | null;
}

export interface EditableEmbed {
    _id?: string;
    title: string;
    description: string;
    url: string;
    color: Color;
    timestamp: Date | null;
    author: EditableEmbedAuthor;
    fields: EditableEmbedField[];
    image: EditableEmbedImage;
    footer: EditableEmbedFooter;
}

export interface EditableEmbedAuthor {
    name: string;
    url: string;
    iconUrl: string;
}

export interface EditableEmbedField {
    name: string;
    value: string;
    inline: boolean;
}

export interface EditableEmbedImage {
    images: string[];
    thumbnail: string;
}

export interface EditableEmbedFooter {
    text: string;
    iconUrl: string;
}


export interface SendableMessage extends Omit<EditableMessage, 'attachments' | 'embeds' | 'author' | 'timestamp'> {
    embeds?: SendableEmbed[];
}

export interface SendableEmbed {
    title: string;
    description: string;
    url: string | null;
    color: string | null;
    timestamp: string | null;
    author: SendableEmbedAuthor | null;
    fields: SendableEmbedField[] | null;
    image: SendableEmbedImage | null;
    footer: SendableEmbedFooter | null;
}

export interface SendableEmbedAuthor {
    name: string;
    url: string | null;
    iconUrl: string | null;
}

export interface SendableEmbedField {
    name: string;
    value: string;
    inline: boolean | null;
}

export interface SendableEmbedImage {
    images: string[];
    thumbnail: string | null;
}

export interface SendableEmbedFooter {
    text: string;
    iconUrl: string | null;
}


export const DefaultEmbed: EditableEmbed = {
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
};

export const DefaultField: EditableEmbedField = {
    name: '',
    value: '',
    inline: false
};
