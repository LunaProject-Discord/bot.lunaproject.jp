import { ConfigurationTimeAndLanguageSchema } from '@/schemas/bot/configuration';
import { SnowflakeSchema } from '@/schemas/snowflake';

export const UserConfigurationSchema = ConfigurationTimeAndLanguageSchema.extend({
    id: SnowflakeSchema
});

export const PartialUserConfigurationSchema = UserConfigurationSchema.omit({ id: true }).partial();
