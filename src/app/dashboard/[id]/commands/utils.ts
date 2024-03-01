import { EditablePermissionOverride } from '@/app/dashboard/[id]/commands/interfaces';
import { GuildConfigurationCommand, GuildConfigurationCommandsPermissionOverrides } from '@/interfaces/bot';
import { RedisCommand } from '@/interfaces/redis';
import { nanoid } from 'nanoid';

export const getCommandConfiguration = (command: RedisCommand, commands: GuildConfigurationCommand[]): GuildConfigurationCommand => commands.find(({ name }) => name === command.name) ?? getDefaultCommandConfiguration(command);

export const getDefaultCommandConfiguration = (command: RedisCommand): GuildConfigurationCommand => ({
    name: command.name,
    enabled: true,
    permissions: {
        channels: {
            default: null,
            overrides: {}
        },
        roles: {
            default: null,
            overrides: {}
        },
        members: {}
    }
});

export const sortCommands = (commands: GuildConfigurationCommand[]) => commands.sort((a, b) => a.name.localeCompare(b.name));

export const asEditablePermissionOverrides = (overrides: GuildConfigurationCommandsPermissionOverrides): EditablePermissionOverride[] =>
    Object.entries(overrides).map(([id, override]) => ({ _id: nanoid(), id, override }));

export const asCommandPermissionOverrides = (overrides: EditablePermissionOverride[]): GuildConfigurationCommandsPermissionOverrides =>
    Object.fromEntries(overrides.map(({ id, override }) => [id, override]));
