import { z } from 'zod';

export const GuildConfigurationPrefixSchema = z.string().min(1).max(32);
export const GuildConfigurationNicknameSchema = z.string().max(32);

export const GuildConfigurationPrefixAndNicknameSchema = z.object({
    prefix: GuildConfigurationPrefixSchema,
    nickname: GuildConfigurationNicknameSchema
});
