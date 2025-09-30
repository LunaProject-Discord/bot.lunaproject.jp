import { GuildWebCategory, GuildWebTag } from '@/interfaces/bot';
import {
    CreateGuildWebPageContentSchema,
    CreateGuildWebPageSchema,
    UpdateGuildWebPageContentSchema,
    UpdateGuildWebPageSchema
} from '@/schemas/bot';
import { JSONContent } from '@tiptap/core';
import { z } from 'zod';

export interface GuildWebPage {
    id: string;
    guildId: string;
    contentId: string | null;
    content: GuildWebPageContent | null;
    contents: GuildWebPageContent[];
    slug: string | null;
    category: GuildWebCategory | null;
    tags: GuildWebTag[];
    published: boolean;
    deletedAt: number | null;
    updatedAt: number;
    createdAt: number;
}

export type CreateGuildWebPage = z.infer<typeof CreateGuildWebPageSchema>;

export type UpdateGuildWebPage = z.infer<typeof UpdateGuildWebPageSchema>;

export interface GuildWebPageContent {
    id: string;
    pageId: string;
    userId: string;
    thumbnail: string | null;
    icon: string | null;
    title: string;
    content: JSONContent;
    published: boolean;
    autoSave: boolean;
    comment: string;
    deletedAt: number | null;
    updatedAt: number;
    createdAt: number;
}

export type CreateGuildWebPageContent = z.infer<typeof CreateGuildWebPageContentSchema>;

export type UpdateGuildWebPageContent = z.infer<typeof UpdateGuildWebPageContentSchema>;
