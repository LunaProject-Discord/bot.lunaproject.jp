import {
    ConfigurationRootSchema,
    ConfigurationTimeAndLanguageSchema,
    GuildConfigurationActivitySchema,
    GuildConfigurationCommandsSchema,
    GuildConfigurationGlobalBanSchema,
    GuildConfigurationGoodbyeSchema,
    GuildConfigurationLevelSchema,
    GuildConfigurationLoggingSchema,
    GuildConfigurationMemberJoinSchema,
    GuildConfigurationMusicSchema,
    GuildConfigurationPrefixAndNicknameSchema,
    GuildConfigurationQuoteSchema,
    GuildConfigurationTranslateSchema,
    GuildConfigurationVoteSchema,
    GuildConfigurationWelcomeSchema
} from '@/schemas/bot';
import { SnowflakeSchema } from '@/schemas/snowflake';

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

export * from './activity';
export * from './commands';
export * from './global_ban';
export * from './goodbye';
export * from './level';
export * from './logging';
export * from './member_join';
export * from './music';
export * from './prefix_and_nickname';
export * from './quote';
export * from './translate';
export * from './vote';
export * from './welcome';
