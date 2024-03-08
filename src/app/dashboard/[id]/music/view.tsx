'use client';

import { NumberFieldItem, SwitchItem } from '@/components/items';
import { SaveConfirmV2 } from '@/components/save_confirm_v2';
import { GuildConfigurationMusic } from '@/interfaces/bot';
import { GuildConfigurationViewProps } from '@/interfaces/view';
import { GuildConfigurationMusicSchema } from '@/schemas/bot';
import { PageHeader } from '@lunaproject/web-core/dist/components/Layout';
import { Section, SectionContent, SectionTitle } from '@lunaproject/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject/web-core/dist/utils';
import { Alert, AlertTitle } from '@mui/material';
import React, { Fragment } from 'react';
import { saveGuildConfiguration } from '../utils';

export const View = ({ guild, configuration, localization }: GuildConfigurationViewProps) => {
    const { translations } = localization;

    const musicConfiguration = configuration.music;
    const [enabled, setEnabled, resetEnabled] = useResettableState(musicConfiguration.enabled);
    const [webPanel, setWebPanel, resetWebPanel] = useResettableState(musicConfiguration.web_panel);
    const [defaultVolume, setDefaultVolume, resetDefaultVolume] = useResettableState(musicConfiguration.default_volume);
    const [timeoutSeconds, setTimeoutSeconds, resetTimeoutSeconds] = useResettableState(musicConfiguration.timeout_seconds);
    const [nextMediaNotification, setNextMediaNotification, resetNextMediaNotification] = useResettableState(musicConfiguration.next_media_notification);
    const [youtube, setYoutube, resetYoutube] = useResettableState(musicConfiguration.sources.youtube);
    const [niconico, setNiconico, resetNiconico] = useResettableState(musicConfiguration.sources.niconico);
    const [soundcloud, setSoundcloud, resetSoundcloud] = useResettableState(musicConfiguration.sources.soundcloud);
    const [twitch, setTwitch, resetTwitch] = useResettableState(musicConfiguration.sources.twitch);
    const [bandcamp, setBandcamp, resetBandcamp] = useResettableState(musicConfiguration.sources.bandcamp);
    const [vimeo, setVimeo, resetVimeo] = useResettableState(musicConfiguration.sources.vimeo);

    const toObject = (): GuildConfigurationMusic => ({
        enabled,
        web_panel: webPanel,
        default_volume: defaultVolume,
        timeout_seconds: timeoutSeconds,
        next_media_notification: nextMediaNotification,
        sources: {
            youtube,
            niconico,
            soundcloud,
            twitch,
            bandcamp,
            vimeo
        }
    });

    const handleSaveAction = () => saveGuildConfiguration(guild.id, { music: toObject() });

    const handleCancelAction = () => {
        resetEnabled();
        resetWebPanel();
        resetDefaultVolume();
        resetTimeoutSeconds();
        resetNextMediaNotification();
        resetYoutube();
        resetNiconico();
        resetSoundcloud();
        resetTwitch();
        resetBandcamp();
        resetVimeo();
    };

    return (
        <Fragment>
            <PageHeader primary={translations.music} secondary={translations.music_description} />
            <Section>
                <SectionContent>
                    <SwitchItem
                        primary={translations.music_enabled}
                        checked={enabled}
                        setChecked={setEnabled}
                    />
                    <SwitchItem
                        primary={translations.music_web_panel}
                        checked={webPanel}
                        setChecked={setWebPanel}
                        disabled={!enabled}
                    />
                    <NumberFieldItem
                        primary={translations.music_default_volume}
                        value={defaultVolume}
                        setValue={setDefaultVolume}
                        pattern="\d*"
                        step={1}
                        min={0}
                        max={100}
                        disabled={!enabled}
                    />
                    <NumberFieldItem
                        primary={translations.music_timeout_seconds}
                        value={timeoutSeconds}
                        setValue={setTimeoutSeconds}
                        pattern="\d*"
                        step={1}
                        min={0}
                        max={300}
                        disabled={!enabled}
                    />
                    <SwitchItem
                        primary={translations.music_next_media_notification}
                        secondary={translations.music_next_media_notification_description}
                        checked={nextMediaNotification}
                        setChecked={setNextMediaNotification}
                        disabled={!enabled}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle color={enabled ? 'text.primary' : 'text.disabled'}>
                    {translations.music_sources}
                </SectionTitle>
                <SectionContent>
                    <Alert severity="warning">
                        <AlertTitle>{translations.dashboard_error_cannot_be_enabled_alert_title}</AlertTitle>
                        {translations.music_source_youtube_error_cannot_be_enabled_alert_description}
                    </Alert>
                    <SwitchItem
                        primary={translations.music_source_youtube}
                        checked={false}
                        setChecked={() => {
                        }}
                        disabled
                    />
                    <SwitchItem
                        primary={translations.music_source_niconico}
                        checked={niconico}
                        setChecked={setNiconico}
                        disabled={!enabled}
                    />
                    <SwitchItem
                        primary={translations.music_source_soundcloud}
                        checked={soundcloud}
                        setChecked={setSoundcloud}
                        disabled={!enabled}
                    />
                    <SwitchItem
                        primary={translations.music_source_twitch}
                        checked={twitch}
                        setChecked={setTwitch}
                        disabled={!enabled}
                    />
                    <SwitchItem
                        primary={translations.music_source_bandcamp}
                        checked={bandcamp}
                        setChecked={setBandcamp}
                        disabled={!enabled}
                    />
                    <SwitchItem
                        primary={translations.music_source_vimeo}
                        checked={vimeo}
                        setChecked={setVimeo}
                        disabled={!enabled}
                    />
                </SectionContent>
            </Section>

            <SaveConfirmV2
                label={translations.save_confirm_settings}
                source={musicConfiguration}
                target={toObject()}
                schema={GuildConfigurationMusicSchema}
                onSave={handleSaveAction}
                onCancel={handleCancelAction}
                localization={localization}
            />
        </Fragment>
    );
};
