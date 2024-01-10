import {
    DataEmbedAuthorSchema,
    DataEmbedFieldSchema,
    DataEmbedFooterSchema,
    DataEmbedImageSchema,
    DataEmbedSchema,
    DataMessageSchema
} from '@schemas/message';
import { z } from 'zod';

export type DataMessage = z.infer<typeof DataMessageSchema>;

export type DataEmbed = z.infer<typeof DataEmbedSchema>;

export type DataEmbedAuthor = z.infer<typeof DataEmbedAuthorSchema>;

export type DataEmbedField = z.infer<typeof DataEmbedFieldSchema>;

export type DataEmbedImage = z.infer<typeof DataEmbedImageSchema>;

export type DataEmbedFooter = z.infer<typeof DataEmbedFooterSchema>;
