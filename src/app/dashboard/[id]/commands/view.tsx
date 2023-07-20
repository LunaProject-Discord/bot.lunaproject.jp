'use client';

import { Channels, Members, Roles } from '@app/dashboard/[id]/commands/_components';
import {
    asCommandPermissionOverrides,
    asEditablePermissionOverrides,
    getCommandConfiguration,
    getDefaultCommandConfiguration,
    sortCommands
} from '@app/dashboard/[id]/commands/utils';
import { PageContent, PageHeader } from '@components/layout';
import { SaveConfirm } from '@components/save_confirm';
import { codeStyled } from '@components/text';
import { GuildConfigurationCommand, GuildConfigurationCommands } from '@interfaces/bot';
import { LocalizationProps } from '@interfaces/localization';
import { RedisCommand } from '@interfaces/redis';
import { GuildConfigurationViewProps, GuildViewProps } from '@interfaces/view';
import { ButtonBase } from '@lunaproject-discord/web-core/dist/components/ButtonBase';
import { Section, SectionContent, SectionTitle } from '@lunaproject-discord/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject-discord/web-core/dist/utils';
import { Box, styled, Switch, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { getStateActionValue } from '@utils/state';
import deepEqual from 'deep-equal';
import React, { Dispatch, Fragment, memo, SetStateAction, useCallback, useMemo, useState } from 'react';
import { saveGuildConfiguration } from '../utils';
import { ManageCommandDialog } from './_dialog';

const GridButton = styled(ButtonBase)(({ theme }) => ({
    width: '100%',
    height: '100%',
    minHeight: 150,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: theme.spacing(1),
    textAlign: 'start',
    border: `solid 1px ${theme.palette.divider}`,
    borderRadius: theme.spacing(.5)
}));

interface SetCommandValueAction {
    action: SetStateAction<GuildConfigurationCommand>;
    command: RedisCommand;
}

interface CommandItemProps extends GuildViewProps, LocalizationProps {
    setOpen: Dispatch<SetStateAction<boolean>>;
    value: GuildConfigurationCommand;
    setValue: Dispatch<SetCommandValueAction>;
    command: RedisCommand;
}

const CommandItem = memo<CommandItemProps>((
    {
        setOpen: _setOpen,
        value,
        setValue,
        command,
        guild,
        localization
    }
) => {
    const { locale } = localization;

    const descriptions = command.description.split('/');

    const [open, setOpen] = useState(false);

    const setDialogOpen = useCallback((value: SetStateAction<boolean>) => {
        setOpen(value);
        _setOpen(value);
    }, [_setOpen]);

    const setCommandValue = useCallback((action: SetStateAction<GuildConfigurationCommand>) => setValue({
        action,
        command
    }), [setValue, command]);

    return (
        <Fragment>
            <Grid xs={12} md={3}>
                <GridButton onClick={() => setDialogOpen(true)}>
                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                        <Typography
                            variant="h6"
                            sx={(theme) => ({
                                ...codeStyled(theme),
                                fontSize: 'initial'
                            })}
                        >
                            {command.name}
                        </Typography>
                        <Switch
                            checked={value.enabled}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                setCommandValue(({ enabled, ...command }) => ({ ...command, enabled: !enabled }));
                            }}
                            tabIndex={-1}
                            sx={{ ml: 'auto' }}
                        />
                    </Box>
                    <Typography>{descriptions.length > 1 ? descriptions[locale === 'ja' ? 0 : 1].trim() : descriptions[0]}</Typography>
                </GridButton>
            </Grid>

            <ManageCommandDialog
                open={open}
                setOpen={setDialogOpen}
                value={value}
                setValue={setCommandValue}
                guild={guild}
                localization={localization}
            />
        </Fragment>
    );
}, ({ value: oldValue }, { value: newValue }) => deepEqual(oldValue, newValue, { strict: true }));
CommandItem.displayName = 'CommandItem';

interface Props extends GuildConfigurationViewProps {
    commands: RedisCommand[];
}

export const View = ({ guild, configuration, commands: redisCommands, localization }: Props) => {
    const { translations } = localization;

    const categorizedCommands = useMemo(() => Object.entries(redisCommands.reduce((acc, command) => {
        const category = command.category;
        if (category === 'MANAGEMENT')
            return acc;

        acc[category] = acc[category] || [];
        acc[category].push(command);
        acc[category].sort((a, b) => a.index - b.index);

        return acc;
    }, {} as Record<string, RedisCommand[]>)).sort(([, aCommands], [, bCommands]) => aCommands[0].index - bCommands[0].index), [redisCommands]);

    const [openDisabledChannelsDialog, setOpenDisabledChannelsDialog] = useState(false);
    const [openDisabledRolesDialog, setOpenDisabledRolesDialog] = useState(false);
    const [openManageCommandDialog, setOpenManageCommandDialog] = useState(false);

    const commandsConfiguration = useMemo<GuildConfigurationCommands>(() => ({
        ...configuration.commands,
        commands: sortCommands(configuration.commands.commands)
    }), [configuration]);
    const [defaultChannels, setDefaultChannels, resetDefaultChannels] = useResettableState(commandsConfiguration.permissions.channels.default);
    const [defaultRoles, setDefaultRoles, resetDefaultRoles] = useResettableState(commandsConfiguration.permissions.roles.default);
    const [overrideChannels, setOverrideChannels, resetOverrideChannels] = useResettableState(asEditablePermissionOverrides(commandsConfiguration.permissions.channels.overrides));
    const [overrideRoles, setOverrideRoles, resetOverrideRoles] = useResettableState(asEditablePermissionOverrides(commandsConfiguration.permissions.roles.overrides));
    const [members, setMembers, resetMembers] = useResettableState(asEditablePermissionOverrides(commandsConfiguration.permissions.members));
    const [commands, setCommands, resetCommands] = useResettableState(commandsConfiguration.commands);

    const toObject = (): GuildConfigurationCommands => ({
        permissions: {
            channels: {
                default: defaultChannels,
                overrides: asCommandPermissionOverrides(overrideChannels)
            },
            roles: {
                default: defaultRoles,
                overrides: asCommandPermissionOverrides(overrideRoles)
            },
            members: asCommandPermissionOverrides(members)
        },
        commands: sortCommands(commands)
    });

    const handleSaveAction = () => saveGuildConfiguration(guild.id, { commands: toObject() });

    const handleCancelAction = () => {
        resetDefaultChannels();
        resetDefaultRoles();
        resetOverrideChannels();
        resetOverrideRoles();
        resetMembers();
        resetCommands();
    };

    const updateCommand = useCallback(({ action, command: redisCommand }: SetCommandValueAction) => {
        const command = getStateActionValue(action, getCommandConfiguration(redisCommand, commands));
        setCommands((values) => {
            let data = [...values];

            const i = data.findIndex(({ name }) => name === command.name);
            if (i !== -1)
                data.splice(i, 1);

            if (!deepEqual(command, getDefaultCommandConfiguration(redisCommand), { strict: true }))
                data.push(command);

            return data;
        });
    }, [commands, setCommands]);

    return (
        <Fragment>
            <PageContent>
                <PageHeader>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                        <Typography variant="h4">{translations.commands}</Typography>
                        <Typography>{translations.commands_description}</Typography>
                    </Box>
                </PageHeader>
                <Channels
                    default={defaultChannels}
                    setDefault={setDefaultChannels}
                    overrides={overrideChannels}
                    setOverrides={setOverrideChannels}
                    channels={guild.channels}
                    localization={localization}
                />
                <Roles
                    default={defaultRoles}
                    setDefault={setDefaultRoles}
                    overrides={overrideRoles}
                    setOverrides={setOverrideRoles}
                    roles={guild.roles.filter((role) => role.position !== 0)}
                    localization={localization}
                />
                <Members
                    value={members}
                    setValue={setMembers}
                    members={guild.members}
                    localization={localization}
                />
                {categorizedCommands.map(([category, redisCommands]) => (
                    <Section key={category}>
                        <SectionTitle>{category}</SectionTitle>
                        <SectionContent>
                            <Grid container spacing={2}>
                                {redisCommands.map((command) => (
                                    <CommandItem
                                        key={command.name}
                                        setOpen={setOpenManageCommandDialog}
                                        value={getCommandConfiguration(command, commands)}
                                        setValue={updateCommand}
                                        command={command}
                                        guild={guild}
                                        localization={localization}
                                    />
                                ))}
                            </Grid>
                        </SectionContent>
                    </Section>
                ))}

                <SaveConfirm
                    open={!deepEqual(commandsConfiguration, toObject(), { strict: true })}
                    disableKeyboardShortcuts={openDisabledChannelsDialog || openDisabledRolesDialog || openManageCommandDialog}
                    onSave={handleSaveAction}
                    onCancel={handleCancelAction}
                />
            </PageContent>
        </Fragment>
    );
};
