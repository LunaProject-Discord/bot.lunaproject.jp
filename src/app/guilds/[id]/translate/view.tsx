'use client';

import { useResettableState } from '@lunaproject-discord/web-core/dist/utils';
import { APIGuildChannel } from '@lunaproject-discord/web-discord';
import { Box, Typography } from '@mui/material';
import deepEqual from 'deep-equal';
import { APIGuildForumChannel, APIGuildStageVoiceChannel, APIRole, ChannelType } from 'discord-api-types/v10';
import React, { MouseEvent, useState } from 'react';
import { ManageDisabledChannelsDialog, ManageDisabledRolesDialog } from '../../../../components/dialog';
import { ActionItem, SwitchItem } from '../../../../components/items';
import { PageContent, PageHeader } from '../../../../components/layout';
import { SaveConfirm } from '../../../../components/save_confirm';
import { Section, SectionContent } from '../../../../components/section';
import { GuildSettingsTranslate } from '../../../../interfaces/bot';
import { GuildSettingsViewProps } from '../../../../interfaces/view';
import { StyledToolbar } from '../navigation';
import { saveGuildSettings } from '../utils';

interface Props extends GuildSettingsViewProps {
    channels: APIGuildChannel[];
    roles: APIRole[];
}

export const View = ({ guild, channels, roles, settings, translations }: Props) => {
    const [openDisabledChannelsDialog, setOpenDisabledChannelsDialog] = useState(false);
    const [openDisabledRolesDialog, setOpenDisabledRolesDialog] = useState(false);

    const translate = settings.translate;
    const [enabled, setEnabled, resetEnabled] = useResettableState(translate.enabled);
    const [reaction, setReaction, resetReaction] = useResettableState(translate.reaction);

    const toObject = (): GuildSettingsTranslate => ({
        enabled,
        reaction,
        disabled: translate.disabled
    });

    const handleClickDisabledChannelsDialogSaveButton = (e: MouseEvent<HTMLButtonElement>, channels: string[]) => saveGuildSettings(
        guild.id,
        {
            translate: {
                ...translate,
                disabled: {
                    ...translate.disabled,
                    channels
                }
            }
        }
    );

    const handleClickDisabledRolesDialogSaveButton = (e: MouseEvent<HTMLButtonElement>, roles: string[]) => saveGuildSettings(
        guild.id,
        {
            translate: {
                ...translate,
                disabled: {
                    ...translate.disabled,
                    roles
                }
            }
        }
    );

    const handleActionSave = () => saveGuildSettings(
        guild.id,
        {
            translate: toObject()
        }
    );

    const handleActionCancel = () => {
        resetEnabled();
        resetReaction();
    };

    return (
        <PageContent position="relative">
            <StyledToolbar />
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.translate}</Typography>
                    <Typography variant="body1">{translations.translate_description}</Typography>
                </Box>
            </PageHeader>
            <Section>
                <SectionContent>
                    <SwitchItem
                        primary={translations.translate_enabled}
                        checked={enabled}
                        setChecked={setEnabled}
                    />
                    <SwitchItem
                        primary={translations.translate_reaction}
                        checked={reaction}
                        setChecked={setReaction}
                        disabled={!enabled}
                    />
                    <ActionItem
                        primary={translations.manage_disabled_channels}
                        secondary={translations.translate_manage_disabled_channels_description}
                        onAction={() => setOpenDisabledChannelsDialog(true)}
                        disabled={!enabled}
                    />
                    <ActionItem
                        primary={translations.manage_disabled_roles}
                        secondary={translations.translate_manage_disabled_roles_description}
                        onAction={() => setOpenDisabledRolesDialog(true)}
                        disabled={!enabled}
                    />
                </SectionContent>
            </Section>
            <ManageDisabledChannelsDialog
                open={openDisabledChannelsDialog}
                onClose={() => setOpenDisabledChannelsDialog(false)}
                choices={channels.filter((channel): channel is Exclude<APIGuildChannel, APIGuildForumChannel | APIGuildStageVoiceChannel> => channel.type !== ChannelType.GuildForum && channel.type !== ChannelType.GuildStageVoice)}
                values={translate.disabled.channels}
                onClickSaveButton={handleClickDisabledChannelsDialogSaveButton}
            />
            <ManageDisabledRolesDialog
                open={openDisabledRolesDialog}
                onClose={() => setOpenDisabledRolesDialog(false)}
                choices={roles}
                values={translate.disabled.roles}
                onClickSaveButton={handleClickDisabledRolesDialogSaveButton}
            />
            <SaveConfirm
                open={!deepEqual(translate, toObject(), { strict: true })}
                disableKeyboardShortcuts={openDisabledChannelsDialog || openDisabledRolesDialog}
                onSave={handleActionSave}
                onCancel={handleActionCancel}
            />
        </PageContent>
    );
};
