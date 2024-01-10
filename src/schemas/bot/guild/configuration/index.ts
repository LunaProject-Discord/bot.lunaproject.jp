import { GuildConfigurationVoteSchema } from '@schemas/bot';
import { ConfigurationRootSchema, ConfigurationTimeAndLanguageSchema } from '@schemas/bot/configuration';
import { GuildConfigurationActivitySchema } from '@schemas/bot/guild/configuration/activity';
import { GuildConfigurationCommandsSchema } from '@schemas/bot/guild/configuration/commands';
import { GuildConfigurationGlobalBanSchema } from '@schemas/bot/guild/configuration/global_ban';
import { GuildConfigurationGoodbyeSchema } from '@schemas/bot/guild/configuration/goodbye';
import { GuildConfigurationLevelSchema } from '@schemas/bot/guild/configuration/level';
import { GuildConfigurationLoggingSchema } from '@schemas/bot/guild/configuration/logging';
import { GuildConfigurationMemberJoinSchema } from '@schemas/bot/guild/configuration/member_join';
import { GuildConfigurationMusicSchema } from '@schemas/bot/guild/configuration/music';
import { GuildConfigurationPrefixAndNicknameSchema } from '@schemas/bot/guild/configuration/prefix_and_nickname';
import { GuildConfigurationQuoteSchema } from '@schemas/bot/guild/configuration/quote';
import { GuildConfigurationTranslateSchema } from '@schemas/bot/guild/configuration/translate';
import { GuildConfigurationWelcomeSchema } from '@schemas/bot/guild/configuration/welcome';
import { SnowflakeSchema } from '@schemas/snowflake';

export const GuildConfigurationSchema = GuildConfigurationPrefixAndNicknameSchema.extend(ConfigurationTimeAndLanguageSchema.shape).extend({
    id: SnowflakeSchema,
    commands: GuildConfigurationCommandsSchema,
    welcome: GuildConfigurationWelcomeSchema,
    goodbye: GuildConfigurationGoodbyeSchema,
    member_join: GuildConfigurationMemberJoinSchema,
    activity: GuildConfigurationActivitySchema,
    global_chat: ConfigurationRootSchema,
    global_ban: GuildConfigurationGlobalBanSchema,
    level: GuildConfigurationLevelSchema,
    translate: GuildConfigurationTranslateSchema,
    vote: GuildConfigurationVoteSchema,
    quote: GuildConfigurationQuoteSchema,
    music: GuildConfigurationMusicSchema,
    logging: GuildConfigurationLoggingSchema
});

export const PartialGuildConfigurationSchema = GuildConfigurationSchema.omit({ id: true }).partial();

export * from '@schemas/bot/guild/configuration/activity';
export * from '@schemas/bot/guild/configuration/commands';
export * from '@schemas/bot/guild/configuration/global_ban';
export * from '@schemas/bot/guild/configuration/goodbye';
export * from '@schemas/bot/guild/configuration/level';
export * from '@schemas/bot/guild/configuration/logging';
export * from '@schemas/bot/guild/configuration/member_join';
export * from '@schemas/bot/guild/configuration/music';
export * from '@schemas/bot/guild/configuration/prefix_and_nickname';
export * from '@schemas/bot/guild/configuration/quote';
export * from '@schemas/bot/guild/configuration/translate';
export * from '@schemas/bot/guild/configuration/vote';
export * from '@schemas/bot/guild/configuration/welcome';
