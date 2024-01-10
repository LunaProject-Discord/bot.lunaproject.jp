import { z } from 'zod';

export const DataEmbedFooterSchema = z.object({
    text: z.string(),
    iconUrl: z.string().url().nullable()
});

export const DataEmbedImageSchema = z.object({
    images: z.array(z.string().url()),
    thumbnail: z.string().url().nullable()
});

export const DataEmbedFieldSchema = z.object({
    name: z.string(),
    value: z.string(),
    inline: z.boolean().nullable()
});

export const DataEmbedAuthorSchema = z.object({
    name: z.string(),
    url: z.string().url().nullable(),
    iconUrl: z.string().url().nullable()
});

export const DataEmbedSchema = z.object({
    title: z.string(),
    description: z.string(),
    url: z.string().url().nullable(),
    color: z.string().nullable(),
    timestamp: z.string().nullable(),
    author: DataEmbedAuthorSchema.nullable(),
    fields: z.array(DataEmbedFieldSchema).nullable(),
    image: DataEmbedImageSchema.nullable(),
    footer: DataEmbedFooterSchema.nullable()
});

export const DataMessageSchema = z.object({
    content: z.string(),
    embeds: z.array(DataEmbedSchema).optional()
});
