import {
    MessageDataSchema,
    MessageEmbedAuthorSchema,
    MessageEmbedDataSchema,
    MessageEmbedFieldSchema,
    MessageEmbedFooterSchema,
    MessageTimestampDataSchema
} from '@/schemas/message';
import { z } from 'zod';

export type MessageData = z.infer<typeof MessageDataSchema>;

export type MessageEmbedData = z.infer<typeof MessageEmbedDataSchema>;

export type MessageEmbedAuthor = z.infer<typeof MessageEmbedAuthorSchema>;

export type MessageEmbedFooter = z.infer<typeof MessageEmbedFooterSchema>;

export type MessageEmbedField = z.infer<typeof MessageEmbedFieldSchema>;

export type MessageTimestampData = z.infer<typeof MessageTimestampDataSchema>;
