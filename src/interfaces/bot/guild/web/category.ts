import {
    CreateGuildWebCategorySchema,
    ReplaceGuildWebCategoriesCreateSchema,
    ReplaceGuildWebCategoriesSchema,
    ReplaceGuildWebCategoriesUpdateSchema,
    UpdateGuildWebCategorySchema
} from '@/schemas/bot';
import { z } from 'zod';

export interface GuildWebCategory {
    id: string;
    guildId: string;
    slug: string | null;
    color: string;
    name: string;
    description: string;
    parentId: string | null;
    parent: GuildWebCategory | null;
    pageCount: number;
    updatedAt: number;
    createdAt: number;
}

export type CreateGuildWebCategory = z.infer<typeof CreateGuildWebCategorySchema>;

export type UpdateGuildWebCategory = z.infer<typeof UpdateGuildWebCategorySchema>;

export type ReplaceGuildWebCategories = z.infer<typeof ReplaceGuildWebCategoriesSchema>;

export type ReplaceGuildWebCategoriesCreate = z.infer<typeof ReplaceGuildWebCategoriesCreateSchema>;

export type ReplaceGuildWebCategoriesUpdate = z.infer<typeof ReplaceGuildWebCategoriesUpdateSchema>;
