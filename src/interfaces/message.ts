export interface DataMessage {
    content: string;
    embeds?: DataEmbed[];
}

export interface DataEmbed {
    title: string;
    description: string;
    url: string | null;
    color: string | null;
    timestamp: string | null;
    author: DataEmbedAuthor | null;
    fields: DataEmbedField[] | null;
    image: DataEmbedImage | null;
    footer: DataEmbedFooter | null;
}

export interface DataEmbedAuthor {
    name: string;
    url: string | null;
    iconUrl: string | null;
}

export interface DataEmbedField {
    name: string;
    value: string;
    inline: boolean | null;
}

export interface DataEmbedImage {
    images: string[];
    thumbnail: string | null;
}

export interface DataEmbedFooter {
    text: string;
    iconUrl: string | null;
}
