import { ConfigurationTimeAndLanguageSchema } from '@/schemas/bot/configuration';
import { UserConfigurationTranslateSchema } from '@/schemas/bot/user/configuration';
import { SnowflakeSchema } from '@/schemas/snowflake';

export const UserConfigurationSchema = ConfigurationTimeAndLanguageSchema.extend({
    id: SnowflakeSchema,
    translate: UserConfigurationTranslateSchema
});

export const PartialUserConfigurationSchema = UserConfigurationSchema.omit({ id: true }).partial();

export * from './translate';
