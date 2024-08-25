import {
    PartialUserConfigurationSchema,
    UserConfigurationSchema,
    UserConfigurationTranslateLanguageEnumSchema,
    UserConfigurationTranslateLanguageSchema,
    UserConfigurationTranslateSchema
} from '@/schemas/bot';
import { z } from 'zod';

export type UserConfiguration = z.infer<typeof UserConfigurationSchema>;

export type UserConfigurationTranslate = z.infer<typeof UserConfigurationTranslateSchema>;

export type UserConfigurationTranslateLanguage = z.infer<typeof UserConfigurationTranslateLanguageSchema>;

export const UserConfigurationTranslateLanguageArray = UserConfigurationTranslateLanguageEnumSchema.options;

export type PartialUserConfiguration = z.infer<typeof PartialUserConfigurationSchema>;
