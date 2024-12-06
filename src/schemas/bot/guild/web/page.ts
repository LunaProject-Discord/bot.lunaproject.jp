import { z } from 'zod';
import { GuildWebCategoryIdSchema } from './category';
import { GuildWebTagIdSchema } from './tag';
import { REGEX_SLUG } from './utils';

export const GuildWebPageContentIdSchema = z.string().ulid('web_page_content_error_invalid_type_id');

export const GuildWebPageContentIconSchema = z.string().max(8, 'web_page_content_error_too_big_icon').nullable();

// .min(1, 'web_page_content_error_too_small_title').max(128, 'web_page_content_error_too_big_title')
export const GuildWebPageContentTitleSchema = z.string();

export const GuildWebPageContentContentSchema = z.string();

export const GuildWebPageContentPublishedSchema = z.boolean().default(false);

export const GuildWebPageIdSchema = z.string().ulid('web_page_error_invalid_type_id');

export const GuildWebPageSlugSchema = z.string().max(64, 'web_page_error_too_big_slug').regex(REGEX_SLUG, 'web_page_error_invalid_match_slug');

export const GuildWebPageCategorySchema = GuildWebCategoryIdSchema;

export const GuildWebPageTagsSchema = z.array(GuildWebTagIdSchema);

export const CreateGuildWebPageContentSchema = z.object({
    icon: GuildWebPageContentIconSchema.optional(),
    title: GuildWebPageContentTitleSchema,
    content: GuildWebPageContentContentSchema,
    published: GuildWebPageContentPublishedSchema.optional()
});

export const UpdateGuildWebPageContentSchema = z.object({
    published: GuildWebPageContentPublishedSchema.optional(),
    deleted: z.boolean().optional()
});

export const CreateGuildWebPageSchema = z.object({
    slug: GuildWebPageSlugSchema.optional(),
    content: CreateGuildWebPageContentSchema,
    category: GuildWebPageCategorySchema.optional(),
    tags: GuildWebPageTagsSchema.optional()
});

export const UpdateGuildWebPageSchema = z.object({
    slug: GuildWebPageSlugSchema.nullish(),
    category: GuildWebPageCategorySchema.nullish(),
    tags: GuildWebPageTagsSchema.nullish(),
    deleted: z.boolean().optional()
});
