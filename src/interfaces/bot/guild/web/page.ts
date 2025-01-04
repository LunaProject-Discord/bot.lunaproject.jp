import { GuildWebCategory, GuildWebTag } from '@/interfaces/bot';
import {
    CreateGuildWebPageContentSchema,
    CreateGuildWebPageSchema,
    UpdateGuildWebPageContentSchema,
    UpdateGuildWebPageSchema
} from '@/schemas/bot';
import { z } from 'zod';

export interface GuildWebPage {
    id: string;
    guildId: string;
    slug?: string;
    contentId?: string;
    content?: GuildWebPageContent;
    contents: GuildWebPageContent[];
    category?: GuildWebCategory;
    tags: GuildWebTag[];
    deletedAt?: Date;
    updatedAt: Date;
    createdAt: Date;
}

export type CreateGuildWebPage = z.infer<typeof CreateGuildWebPageSchema>;

export type UpdateGuildWebPage = z.infer<typeof UpdateGuildWebPageSchema>;

export interface GuildWebPageContent {
    id: string;
    pageId: string;
    guildId: string;
    userId: string;
    icon?: string;
    title: string;
    content: string;
    published: boolean;
    deletedAt?: Date;
    updatedAt: Date;
    createdAt: Date;
}

export type CreateGuildWebPageContent = z.infer<typeof CreateGuildWebPageContentSchema>;

export type UpdateGuildWebPageContent = z.infer<typeof UpdateGuildWebPageContentSchema>;
