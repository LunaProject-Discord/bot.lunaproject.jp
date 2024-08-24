import { ConfigurationTimeAndLanguageSchema, UserConfigurationTranslateSchema } from '@/schemas/bot';
import { SnowflakeSchema } from '@/schemas/snowflake';

export const UserConfigurationSchema = ConfigurationTimeAndLanguageSchema.extend({
    id: SnowflakeSchema,
    translate: UserConfigurationTranslateSchema
});

export const PartialUserConfigurationSchema = UserConfigurationSchema.omit({ id: true }).partial();

export * from './translate';
