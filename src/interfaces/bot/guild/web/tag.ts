import {
    CreateGuildWebTagSchema,
    ReplaceGuildWebTagsCreateSchema,
    ReplaceGuildWebTagsSchema,
    ReplaceGuildWebTagsUpdateSchema,
    UpdateGuildWebTagSchema
} from '@/schemas/bot';
import { z } from 'zod';

export interface GuildWebTag {
    id: string;
    guildId: string;
    slug: string | null;
    color: string;
    name: string;
    description: string;
    pageCount: number;
    updatedAt: number;
    createdAt: number;
}

export type CreateGuildWebTag = z.infer<typeof CreateGuildWebTagSchema>;

export type UpdateGuildWebTag = z.infer<typeof UpdateGuildWebTagSchema>;

export type ReplaceGuildWebTags = z.infer<typeof ReplaceGuildWebTagsSchema>;

export type ReplaceGuildWebTagsCreate = z.infer<typeof ReplaceGuildWebTagsCreateSchema>;

export type ReplaceGuildWebTagsUpdate = z.infer<typeof ReplaceGuildWebTagsUpdateSchema>;
