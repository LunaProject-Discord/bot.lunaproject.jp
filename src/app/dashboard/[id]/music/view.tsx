'use client';

import { NumberFieldItem, SwitchItem } from '@components/items';
import { PageContent, PageHeader } from '@components/layout';
import { SaveConfirm } from '@components/save_confirm';
import { GuildConfigurationMusic } from '@interfaces/bot';
import { GuildConfigurationViewProps } from '@interfaces/view';
import { Section, SectionContent, SectionTitle } from '@lunaproject-discord/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject-discord/web-core/dist/utils';
import { Box, Typography } from '@mui/material';
import deepEqual from 'deep-equal';
import React from 'react';
import { saveGuildConfiguration } from '../utils';

export const View = ({ guild, configuration, localization: { translations } }: GuildConfigurationViewProps) => {
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
        <PageContent>
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.music}</Typography>
                    <Typography>{translations.music_description}</Typography>
                </Box>
            </PageHeader>
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
                        min={0}
                        max={100}
                        disabled={!enabled}
                    />
                    <NumberFieldItem
                        primary={translations.music_timeout_seconds}
                        value={timeoutSeconds}
                        setValue={setTimeoutSeconds}
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
                <SectionTitle>{translations.music_sources}</SectionTitle>
                <SectionContent>
                    <SwitchItem
                        primary={translations.music_source_youtube}
                        checked={youtube}
                        setChecked={setYoutube}
                        disabled={!enabled}
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

            <SaveConfirm
                open={!deepEqual(musicConfiguration, toObject(), { strict: true })}
                onSave={handleSaveAction}
                onCancel={handleCancelAction}
            />
        </PageContent>
    );
};
