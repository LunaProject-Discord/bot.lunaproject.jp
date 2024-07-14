'use client';

import { Channels, Group, GroupTitle, Members, Roles } from '@/app/dashboard/[id]/commands/_dialog/_components';
import { EditablePermissionOverride } from '@/app/dashboard/[id]/commands/interfaces';
import { asCommandPermissionOverrides, asEditablePermissionOverrides } from '@/app/dashboard/[id]/commands/utils';
import { CancelButton } from '@/components/buttons';
import { Code } from '@/components/text';
import { GuildConfigurationCommand } from '@/interfaces/bot';
import { RedisCommand } from '@/interfaces/redis';
import { GuildViewProps } from '@/interfaces/view';
import { sortChannels, sortMembers, sortRoles } from '@/utils/discord';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    ModalProps
} from '@lunaproject/web-core/dist/components/Dialog';
import { SectionCardVariableProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { ItemFormContainer } from '@lunaproject/web-core/dist/components/SectionItems';
import { getStateActionValue } from '@lunaproject/web-core/dist/utils';
import { Box, ButtonBase, Switch, switchClasses, Theme, Typography, useMediaQuery } from '@mui/material';
import deepEqual from 'deep-equal';
import React, { Fragment, memo, SetStateAction, useCallback, useState } from 'react';

export interface ManageCommandDialogProps extends ModalProps, SectionCardVariableProps<{
    value: GuildConfigurationCommand;
}>, GuildViewProps {
    command: RedisCommand;
}

const ManageCommandDialog = memo<ManageCommandDialogProps>((
    {
        open,
        setOpen,
        value,
        setValue,
        command,
        guild,
        localization
    }
) => {
    const { translations } = localization;

    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));

    const choiceChannels = sortChannels(guild.channels);
    const choiceRoles = sortRoles(guild.roles).filter((role) => role.position !== 0);
    const choiceMembers = sortMembers(guild.members);

    const [defaultChannels, setDefaultChannels] = useState(value.permissions.channels.default);
    const [defaultRoles, setDefaultRoles] = useState(value.permissions.roles.default);
    const [overrideChannels, setOverrideChannels] = useState(asEditablePermissionOverrides(value.permissions.channels.overrides));
    const [overrideRoles, setOverrideRoles] = useState(asEditablePermissionOverrides(value.permissions.roles.overrides));
    const [members, setMembers] = useState(asEditablePermissionOverrides(value.permissions.members));

    const updateChannelsValue = useCallback((defaultValue: boolean | null, overrides: EditablePermissionOverride[]) => setValue((
        {
            permissions,
            ...command
        }
    ) => ({
        ...command,
        permissions: {
            ...permissions,
            channels: {
                default: defaultValue,
                overrides: asCommandPermissionOverrides(overrides)
            }
        }
    })), [setValue]);

    const updateRolesValue = useCallback((defaultValue: boolean | null, overrides: EditablePermissionOverride[]) => setValue((
        {
            permissions,
            ...command
        }
    ) => ({
        ...command,
        permissions: {
            ...permissions,
            roles: {
                default: defaultValue,
                overrides: asCommandPermissionOverrides(overrides)
            }
        }
    })), [setValue]);

    const updateDefaultChannels = useCallback((action: SetStateAction<boolean | null>) => {
        const value = getStateActionValue(action, defaultChannels);
        setDefaultChannels(value);
        updateChannelsValue(value, overrideChannels);
    }, [defaultChannels, overrideChannels, updateChannelsValue]);

    const updateDefaultRoles = useCallback((action: SetStateAction<boolean | null>) => {
        const value = getStateActionValue(action, defaultRoles);
        setDefaultRoles(value);
        updateRolesValue(value, overrideRoles);
    }, [defaultRoles, overrideRoles, updateRolesValue]);

    const updateOverrideChannels = useCallback((action: SetStateAction<EditablePermissionOverride[]>) => {
        const array = getStateActionValue(action, overrideChannels);
        setOverrideChannels(array);
        updateChannelsValue(defaultChannels, array);
    }, [defaultChannels, overrideChannels, updateChannelsValue]);

    const updateOverrideRoles = useCallback((action: SetStateAction<EditablePermissionOverride[]>) => {
        const array = getStateActionValue(action, overrideRoles);
        setOverrideRoles(array);
        updateRolesValue(defaultRoles, array);
    }, [defaultRoles, overrideRoles, updateRolesValue]);

    const updateMembers = useCallback((action: SetStateAction<EditablePermissionOverride[]>) => {
        const array = getStateActionValue(action, members);
        setMembers(array);
        setValue(({ permissions, ...command }) => ({
            ...command,
            permissions: {
                ...permissions,
                members: asCommandPermissionOverrides(array)
            }
        }));
    }, [members, setValue]);

    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullScreen={isMobile}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle sx={{ gap: 1 }}>
                    {translations.command_manage}:
                    <Code>{value.name}</Code>
                </DialogTitle>
                <DialogContent sx={{ p: 0, gap: 2 }}>
                    <ButtonBase
                        onClick={() => setValue(({ enabled, ...command }) => ({ ...command, enabled: !enabled }))}
                        sx={{
                            px: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1,
                            color: 'common.white',
                            bgcolor: 'primary.main'
                        }}
                    >
                        <Typography>{translations.command_enabled}</Typography>
                        <ItemFormContainer sx={{ mr: -.75 }}>
                            <Switch
                                checked={value.enabled}
                                onChange={() => setValue(({ enabled, ...command }) => ({
                                    ...command,
                                    enabled: !enabled
                                }))}
                                disableRipple
                                color="default"
                                tabIndex={-1}
                                sx={{ [`& .${switchClasses.switchBase}`]: { backgroundColor: 'transparent !important' } }}
                            />
                        </ItemFormContainer>
                    </ButtonBase>
                    <Box sx={{ px: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Group>
                            <GroupTitle>{translations.command_user_permissions}</GroupTitle>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>

                            </Box>
                        </Group>
                        <Group>
                            <GroupTitle>{translations.command_bot_permissions}</GroupTitle>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>

                            </Box>
                        </Group>
                        <Channels
                            default={defaultChannels}
                            setDefault={updateDefaultChannels}
                            overrides={overrideChannels}
                            setOverrides={updateOverrideChannels}
                            channels={choiceChannels}
                            localization={localization}
                        />
                        <Roles
                            default={defaultRoles}
                            setDefault={updateDefaultRoles}
                            overrides={overrideRoles}
                            setOverrides={updateOverrideRoles}
                            roles={choiceRoles}
                            localization={localization}
                        />
                        <Members
                            value={members}
                            setValue={updateMembers}
                            members={choiceMembers}
                            localization={localization}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <CancelButton onClick={() => setOpen(false)} variant="outlined" corners="extended">
                        {translations.close}
                    </CancelButton>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}, (
    { open: oldOpen, value: oldValue },
    { open: newOpen, value: newValue }
) => oldOpen === newOpen && deepEqual(oldValue, newValue, { strict: true }));
ManageCommandDialog.displayName = 'ManageCommandDialog';
export { ManageCommandDialog };
