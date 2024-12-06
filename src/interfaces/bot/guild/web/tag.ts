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
    slug?: string;
    color: string;
    name: string;
    description: string;
    updatedAt: Date;
    createdAt: Date;
}

export type CreateGuildWebTag = z.infer<typeof CreateGuildWebTagSchema>;

export type UpdateGuildWebTag = z.infer<typeof UpdateGuildWebTagSchema>;

export type ReplaceGuildWebTags = z.infer<typeof ReplaceGuildWebTagsSchema>;

export type ReplaceGuildWebTagsCreate = z.infer<typeof ReplaceGuildWebTagsCreateSchema>;

export type ReplaceGuildWebTagsUpdate = z.infer<typeof ReplaceGuildWebTagsUpdateSchema>;
