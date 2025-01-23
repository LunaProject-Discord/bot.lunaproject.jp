import { z } from 'zod';
import { REGEX_HEX_COLOR, REGEX_SLUG } from './utils';

export const GuildWebCategoryIdSchema = z.string().ulid('web_category_error_invalid_type_id');

export const GuildWebCategorySlugSchema = z.string().max(64, 'web_category_error_too_big_slug').regex(REGEX_SLUG, 'web_category_error_invalid_match_slug');

export const GuildWebCategoryColorSchema = z.string().min(4, 'web_category_error_too_small_color').max(9, 'web_category_error_too_big_color').regex(REGEX_HEX_COLOR, 'web_category_error_invalid_match_color');

export const GuildWebCategoryNameSchema = z.string().min(1, 'web_category_error_too_small_name').max(128, 'web_category_error_too_big_name');

export const GuildWebCategoryDescriptionSchema = z.string().max(256, 'web_category_error_too_big_description');

export const GuildWebCategoryParentIdSchema = z.string().ulid('web_category_error_invalid_type_parent_id');

export const CreateGuildWebCategorySchema = z.object({
    slug: GuildWebCategorySlugSchema.nullish(),
    color: GuildWebCategoryColorSchema.optional(),
    name: GuildWebCategoryNameSchema,
    description: GuildWebCategoryDescriptionSchema.optional(),
    parentId: GuildWebCategoryParentIdSchema.nullish()
});

export const UpdateGuildWebCategorySchema = z.object({
    slug: GuildWebCategorySlugSchema.nullish(),
    color: GuildWebCategoryColorSchema.optional(),
    name: GuildWebCategoryNameSchema.optional(),
    description: GuildWebCategoryDescriptionSchema.optional(),
    parentId: GuildWebCategoryParentIdSchema.nullish()
});

export const ReplaceGuildWebCategoriesUpdateSchema = UpdateGuildWebCategorySchema.extend({
    id: GuildWebCategoryIdSchema
});

export const ReplaceGuildWebCategoriesCreateSchema = CreateGuildWebCategorySchema;

export const ReplaceGuildWebCategoriesSchema = z.array(
    z.union([
        ReplaceGuildWebCategoriesUpdateSchema,
        ReplaceGuildWebCategoriesCreateSchema
    ])
);
