import { z } from 'zod';

export const MessageTimestampDataSchema = z.discriminatedUnion(
    'type',
    [
        z.object({
            type: z.literal('value'),
            value: z.number()
        }),
        z.object({
            type: z.literal('now')
        })
    ]
);

export const MessageUrlSchema = z.string().superRefine((value, ctx) => {
    if (value.length < 1)
        return;

    try {
        new URL(value);
    } catch (e) {
        ctx.addIssue({
            code: z.ZodIssueCode.invalid_string,
            validation: 'url'
        });
    }
});
export const MessageContentSchema = z.string().max(2000);
export const MessageEmbedTitleSchema = z.string().trim().max(256);
export const MessageEmbedDescriptionSchema = z.string().trim().max(4096);
export const MessageEmbedAuthorNameSchema = z.string().trim().max(256);
export const MessageEmbedFooterTextSchema = z.string().trim().max(2048);
export const MessageEmbedFieldNameSchema = z.string().trim().max(256);
export const MessageEmbedFieldValueSchema = z.string().trim().max(1024);

export const MessageEmbedFieldSchema = z.object({
    name: MessageEmbedFieldNameSchema,
    value: MessageEmbedFieldValueSchema,
    inline: z.boolean().nullable()
});

export const MessageEmbedFooterSchema = z.object({
    text: MessageEmbedFooterTextSchema,
    icon_url: MessageUrlSchema
});

export const MessageEmbedAuthorSchema = z.object({
    name: MessageEmbedAuthorNameSchema,
    url: MessageUrlSchema,
    icon_url: MessageUrlSchema
});

export const MessageEmbedDataSchema = z.object({
    title: MessageEmbedTitleSchema,
    description: MessageEmbedDescriptionSchema,
    url: MessageUrlSchema,
    color: z.number().nullable(),
    timestamp: MessageTimestampDataSchema.nullable(),
    author: MessageEmbedAuthorSchema,
    footer: MessageEmbedFooterSchema,
    fields: z.array(MessageEmbedFieldSchema).max(25),
    image: MessageUrlSchema,
    thumbnail: MessageUrlSchema
});

export const MessageDataSchema = z.object({
    content: MessageContentSchema,
    embeds: z.array(MessageEmbedDataSchema).max(10)
});
