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
    slug?: string;
    color: string;
    name: string;
    description: string;
    parentId?: string;
    parent?: GuildWebCategory;
    updatedAt: Date;
    createdAt: Date;
}

export type CreateGuildWebCategory = z.infer<typeof CreateGuildWebCategorySchema>;

export type UpdateGuildWebCategory = z.infer<typeof UpdateGuildWebCategorySchema>;

export type ReplaceGuildWebCategories = z.infer<typeof ReplaceGuildWebCategoriesSchema>;

export type ReplaceGuildWebCategoriesCreate = z.infer<typeof ReplaceGuildWebCategoriesCreateSchema>;

export type ReplaceGuildWebCategoriesUpdate = z.infer<typeof ReplaceGuildWebCategoriesUpdateSchema>;
