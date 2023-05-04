'use client';

import { Section, SectionContent } from '@lunaproject-discord/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject-discord/web-core/dist/utils';
import { Box, Typography } from '@mui/material';
import deepEqual from 'deep-equal';
import { ChannelType } from 'discord-api-types/v10';
import React, { Fragment, MouseEvent, useState } from 'react';
import { ManageDisabledChannelsDialog, ManageDisabledRolesDialog } from '../../../../components/dialog';
import { ActionItem, SwitchItem } from '../../../../components/items';
import { PageContent, PageHeader } from '../../../../components/layout';
import { SaveConfirm } from '../../../../components/save_confirm';
import { GuildSettingsTranslate } from '../../../../interfaces/bot';
import { GuildSettingsViewProps } from '../../../../interfaces/view';
import { saveGuildSettings } from '../utils';

export const View = ({ guild, settings, localization }: GuildSettingsViewProps) => {
    const { translations } = localization;

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
        <Fragment>
            <PageContent>
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

                <SaveConfirm
                    open={!deepEqual(translate, toObject(), { strict: true })}
                    disableKeyboardShortcuts={openDisabledChannelsDialog || openDisabledRolesDialog}
                    onSave={handleActionSave}
                    onCancel={handleActionCancel}
                />
            </PageContent>

            <ManageDisabledChannelsDialog
                open={openDisabledChannelsDialog}
                onClose={() => setOpenDisabledChannelsDialog(false)}
                choices={guild.channels.filter((channel) => channel.type !== ChannelType.GuildForum && channel.type !== ChannelType.GuildStageVoice)}
                values={translate.disabled.channels}
                onClickSaveButton={handleClickDisabledChannelsDialogSaveButton}
                localization={localization}
            />
            <ManageDisabledRolesDialog
                open={openDisabledRolesDialog}
                onClose={() => setOpenDisabledRolesDialog(false)}
                choices={guild.roles}
                values={translate.disabled.roles}
                onClickSaveButton={handleClickDisabledRolesDialogSaveButton}
                localization={localization}
            />
        </Fragment>
    );
};
