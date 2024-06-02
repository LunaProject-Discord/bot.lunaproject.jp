import { ConfigurationTimeAndLanguageSchema } from '@/schemas/bot';
import { SnowflakeSchema } from '@/schemas/snowflake';

export const UserConfigurationSchema = ConfigurationTimeAndLanguageSchema.extend({
    id: SnowflakeSchema
});

export const PartialUserConfigurationSchema = UserConfigurationSchema.omit({ id: true }).partial();
