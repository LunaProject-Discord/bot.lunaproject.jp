import { z } from 'zod';
import { REGEX_HEX_COLOR, REGEX_SLUG } from './utils';

export const GuildWebTagIdSchema = z.string().ulid('web_tag_error_invalid_type_id');

export const GuildWebTagSlugSchema = z.string().max(64, 'web_tag_error_too_big_slug').regex(REGEX_SLUG, 'web_tag_error_invalid_match_slug');

export const GuildWebTagColorSchema = z.string().min(4, 'web_tag_error_too_small_color').max(9, 'web_tag_error_too_big_color').regex(REGEX_HEX_COLOR, 'web_tag_error_invalid_match_color');

export const GuildWebTagNameSchema = z.string().min(1, 'web_tag_error_too_small_name').max(64, 'web_tag_error_too_big_name');

export const GuildWebTagDescriptionSchema = z.string().max(128, 'web_tag_error_too_big_description');

export const CreateGuildWebTagSchema = z.object({
    slug: GuildWebTagSlugSchema.optional(),
    color: GuildWebTagColorSchema.optional(),
    name: GuildWebTagNameSchema,
    description: GuildWebTagDescriptionSchema.optional()
});

export const UpdateGuildWebTagSchema = z.object({
    slug: GuildWebTagSlugSchema.nullish(),
    color: GuildWebTagColorSchema.optional(),
    name: GuildWebTagNameSchema.optional(),
    description: GuildWebTagDescriptionSchema.optional()
});

export const ReplaceGuildWebTagsUpdateSchema = UpdateGuildWebTagSchema.extend({
    id: GuildWebTagIdSchema
});

export const ReplaceGuildWebTagsCreateSchema = CreateGuildWebTagSchema;

export const ReplaceGuildWebTagsSchema = z.array(
    z.union([
        ReplaceGuildWebTagsUpdateSchema,
        ReplaceGuildWebTagsCreateSchema
    ])
);
