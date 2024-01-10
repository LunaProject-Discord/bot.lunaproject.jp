import { SnowflakeSchema } from '@schemas/snowflake';
import { z } from 'zod';

export const GuildConfigurationCommandsPermissionOverridesSchema = z.record(SnowflakeSchema, z.boolean());

export const GuildConfigurationCommandsPermissionSchema = z.object({
    default: z.boolean().nullable(),
    overrides: GuildConfigurationCommandsPermissionOverridesSchema
});

export const GuildConfigurationCommandsPermissionsSchema = z.object({
    channels: GuildConfigurationCommandsPermissionSchema,
    roles: GuildConfigurationCommandsPermissionSchema,
    members: GuildConfigurationCommandsPermissionOverridesSchema
});

export const GuildConfigurationCommandSchema = z.object({
    name: z.string(),
    enabled: z.boolean(),
    permissions: GuildConfigurationCommandsPermissionsSchema
});

export const GuildConfigurationCommandsSchema = z.object({
    permissions: GuildConfigurationCommandsPermissionsSchema,
    commands: z.array(GuildConfigurationCommandSchema)
});
