'use client';

import { CancelButton } from '@/components/buttons';
import { SaveConfirmV2 } from '@/components/save_confirm_v2';
import { SectionChannelSelectCard, SectionMessageCard } from '@/components/section_card';
import { CodeStyleContainer } from '@/components/text';
import { GuildConfigurationWelcome } from '@/interfaces/bot';
import { GuildConfigurationViewProps } from '@/interfaces/view';
import { GuildConfigurationWelcomeSchema } from '@/schemas/bot';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@lunaproject/web-core/dist/components/Dialog';
import { PageHeader } from '@lunaproject/web-core/dist/components/Layout';
import { Section, SectionContent } from '@lunaproject/web-core/dist/components/Section';
import { SectionSwitchCard } from '@lunaproject/web-core/dist/components/SectionCard';
import { useResettableState } from '@lunaproject/web-core/dist/utils';
import { Alert, AlertTitle, Backdrop, Box, Button, CircularProgress, Typography } from '@mui/material';
import { ChannelType } from 'discord-api-types/v10';
import { useRouter } from 'next/navigation';
import React, { Fragment, useState } from 'react';
import { saveGuildConfiguration } from '../utils';

export const View = ({ guild, configuration, localization }: GuildConfigurationViewProps) => {
    const { translations } = localization;

    const router = useRouter();

    const [openMigrationDialog, setOpenMigrationDialog] = useState(false);
    const [openMigratingBackdrop, setOpenMigratingBackdrop] = useState(false);

    const [openMessageBuilder, setOpenMessageBuilder] = useState(false);

    const welcomeConfiguration = configuration.welcome;
    const [enabled, setEnabled, resetEnabled] = useResettableState(welcomeConfiguration.enabled);
    const [channelId, setChannelId, resetChannelId] = useResettableState(welcomeConfiguration.channel_id);
    const [message, setMessage, resetMessage] = useResettableState(welcomeConfiguration.message);
    const [roles, setRoles, resetRoles] = useResettableState(welcomeConfiguration.roles);

    const toObject = (): GuildConfigurationWelcome => ({ enabled, channel_id: channelId, message, roles });

    const handleSaveAction = () => saveGuildConfiguration(guild.id, { welcome: toObject() });

    const handleCancelAction = () => {
        resetEnabled();
        resetChannelId();
        resetMessage();
        resetRoles();
    };

    const handleNewAction = async () => {
        setOpenMigratingBackdrop(true);

        const res = await fetch(
            `/api/guilds/${guild.id}/migrates/member-join`,
            {
                method: 'POST',
                credentials: 'include'
            }
        );

        if (!res.ok) {
            setOpenMigratingBackdrop(false);
            return;
        }

        setOpenMigratingBackdrop(false);
        setOpenMigrationDialog(false);

        router.refresh();
        router.push(`/dashboard/${guild.id}/member-join`);
    };

    const handleMigrateAction = async () => {
        setOpenMigratingBackdrop(true);

        const res = await fetch(
            `/api/guilds/${guild.id}/migrates/member-join`,
            {
                method: 'PATCH',
                credentials: 'include'
            }
        );

        if (!res.ok) {
            setOpenMigratingBackdrop(false);
            return;
        }

        setOpenMigratingBackdrop(false);
        setOpenMigrationDialog(false);

        router.refresh();
        router.push(`/dashboard/${guild.id}/member-join`);
    };

    return (
        <Fragment>
            <PageHeader primary={translations.welcome_message} secondary={translations.welcome_message_description} />
            <Section>
                <SectionContent>
                    <Alert severity="info">
                        <AlertTitle>「ようこそ (参加) メッセージ」が生まれ変わります！</AlertTitle>
                        <Box sx={{ mb: .5 }}>
                            ルール スクリーニングへの対応や、ユーザーや Bot に自動で役職を付与できるようになります。<br />
                            現在、この機能はベータ公開中です。利用するには設定が必要です。
                        </Box>
                        <Button
                            onClick={() => setOpenMigrationDialog(true)}
                            disableElevation
                            variant="contained"
                            color="inherit"
                        >
                            今すぐ試す
                        </Button>
                    </Alert>
                </SectionContent>
            </Section>
            <Section>
                <SectionContent>
                    <SectionSwitchCard
                        primary={translations.welcome_message_enabled}
                        checked={enabled}
                        setChecked={setEnabled}
                    />
                    <SectionChannelSelectCard
                        primary={translations.send_message_channel}
                        value={channelId}
                        setValue={setChannelId}
                        choices={guild.channels.filter((channel) => channel.type !== ChannelType.GuildForum && channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildStageVoice)}
                        disabled={!enabled}
                        localization={localization}
                    />
                    <SectionMessageCard
                        primary={translations.customize_message}
                        secondary={translations.welcome_message_edit_description}
                        value={message}
                        setValue={setMessage}
                        open={openMessageBuilder}
                        setOpen={setOpenMessageBuilder}
                        disabled={!enabled}
                        localization={localization}
                    >
                        <CodeStyleContainer>
                            {translations.welcome_message_edit_hint}
                        </CodeStyleContainer>
                    </SectionMessageCard>
                </SectionContent>
            </Section>

            <Dialog open={openMigrationDialog} onClose={() => setOpenMigrationDialog(false)}>
                <DialogTitle>
                    「メンバーの参加」の利用開始
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        現在、この機能はベータ公開中です。<br />
                        そのため、この機能を利用した際に発生した一切の損害についての責任は負いませんのでご注意ください。<br />
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }}>ようこそ (参加) メッセージ からの改善点</Typography>
                    <ul className="list-disc mt-1 ps-5">
                        <li>ユーザーや Bot に役職を付与できるように</li>
                        <li>メンバーのルール スクリーニング状態に応じて動作するように</li>
                    </ul>
                    <Typography variant="h6" sx={{ mt: 1 }}>この機能の利用について</Typography>
                    <Typography>
                        この機能が正式公開されるまでは、従来の機能と切り替えて使用することができます。<br />
                        この機能を利用するには ようこそ (参加) メッセージ の設定を引き継ぐか、新しく設定する必要があります。<br />
                        下のボタンを押して機能の利用開始方法を選択してください。
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <CancelButton onClick={() => setOpenMigrationDialog(false)} sx={{ mr: 'auto' }}>
                        {translations.cancel}
                    </CancelButton>
                    <Button onClick={handleNewAction}>
                        新しく設定する
                    </Button>
                    <Button onClick={handleMigrateAction} variant="contained">
                        設定を引き継ぐ
                    </Button>
                </DialogActions>
            </Dialog>
            <Backdrop open={openMigratingBackdrop} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <SaveConfirmV2
                label={translations.save_confirm_settings}
                source={welcomeConfiguration}
                target={toObject()}
                schema={GuildConfigurationWelcomeSchema}
                disableKeyboardShortcuts={openMessageBuilder}
                onSave={handleSaveAction}
                onCancel={handleCancelAction}
                localization={localization}
            />
        </Fragment>
    );
};
