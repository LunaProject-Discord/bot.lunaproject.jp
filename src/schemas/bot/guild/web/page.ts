import { JSONContent } from '@tiptap/react';
import { z } from 'zod';
import { GuildWebCategoryIdSchema } from './category';
import { GuildWebTagIdSchema } from './tag';
import { REGEX_SLUG } from './utils';

export const GuildWebPageContentIdSchema = z.string().ulid('web_page_content_error_invalid_type_id');

export const GuildWebPageContentIconSchema = z.string().max(8, 'web_page_content_error_too_big_icon').nullable();

// .min(1, 'web_page_content_error_too_small_title').max(128, 'web_page_content_error_too_big_title')
export const GuildWebPageContentTitleSchema = z.string();

export const GuildWebPageContentContentSchema: z.ZodSchema<JSONContent> = z.lazy(() => z.intersection(
    z.object({
        type: z.string().optional(),
        attrs: z.record(z.any()).optional(),
        content: z.array(GuildWebPageContentContentSchema).optional(),
        marks: z.array(
            z.intersection(
                z.object({
                    type: z.string(),
                    attrs: z.record(z.any()).optional()
                }),
                z.record(z.any())
            )
        ).optional(),
        text: z.string().optional()
    }),
    z.record(z.any())
));

export const GuildWebPageContentPublishedSchema = z.boolean().default(false);

export const GuildWebPageContentAutoSavedSchema = z.boolean().default(false);

export const GuildWebPageContentCommentSchema = z.string().max(256, 'web_page_content_error_too_big_comment');

export const GuildWebPageIdSchema = z.string().ulid('web_page_error_invalid_type_id');

export const GuildWebPageSlugSchema = z.string().max(64, 'web_page_error_too_big_slug').regex(REGEX_SLUG, 'web_page_error_invalid_match_slug');

export const GuildWebPageContentSchema = GuildWebPageContentIdSchema;

export const GuildWebPageCategorySchema = GuildWebCategoryIdSchema;

export const GuildWebPageTagsSchema = z.array(GuildWebTagIdSchema);

export const CreateGuildWebPageContentSchema = z.object({
    thumbnail: GuildWebPageContentIconSchema.nullish(),
    icon: GuildWebPageContentIconSchema.nullish(),
    title: GuildWebPageContentTitleSchema,
    content: GuildWebPageContentContentSchema,
    published: GuildWebPageContentPublishedSchema.optional(),
    autoSave: GuildWebPageContentAutoSavedSchema.optional(),
    comment: GuildWebPageContentCommentSchema.optional()
});

export const UpdateGuildWebPageContentSchema = z.object({
    published: GuildWebPageContentPublishedSchema.optional(),
    comment: GuildWebPageContentCommentSchema.optional(),
    deleted: z.boolean().optional()
});

export const CreateGuildWebPageSchema = z.object({
    slug: GuildWebPageSlugSchema.nullish(),
    content: CreateGuildWebPageContentSchema.nullish(),
    category: GuildWebPageCategorySchema.nullish(),
    tags: GuildWebPageTagsSchema.optional()
});

export const UpdateGuildWebPageSchema = z.object({
    slug: GuildWebPageSlugSchema.nullish(),
    content: GuildWebPageContentSchema.nullish(),
    category: GuildWebPageCategorySchema.nullish(),
    tags: GuildWebPageTagsSchema.optional(),
    deleted: z.boolean().optional()
});
