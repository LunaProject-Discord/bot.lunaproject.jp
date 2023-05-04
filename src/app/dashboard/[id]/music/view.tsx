'use client';

import { Section, SectionContent, SectionTitle } from '@lunaproject-discord/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject-discord/web-core/dist/utils';
import { Box, Typography } from '@mui/material';
import deepEqual from 'deep-equal';
import React from 'react';
import { SwitchItem } from '../../../../components/items';
import { PageContent, PageHeader } from '../../../../components/layout';
import { SaveConfirm } from '../../../../components/save_confirm';
import { GuildSettingsMusic } from '../../../../interfaces/bot';
import { GuildSettingsViewProps } from '../../../../interfaces/view';
import { saveGuildSettings } from '../utils';

export const View = ({ guild, settings, localization: { translations } }: GuildSettingsViewProps) => {
    const music = settings.music;
    const [enabled, setEnabled, resetEnabled] = useResettableState(music.enabled);
    const [webPanel, setWebPanel, resetWebPanel] = useResettableState(music.web_panel);
    const [youtube, setYoutube, resetYoutube] = useResettableState(music.sources.youtube);
    const [niconico, setNiconico, resetNiconico] = useResettableState(music.sources.niconico);
    const [soundcloud, setSoundcloud, resetSoundcloud] = useResettableState(music.sources.soundcloud);
    const [twitch, setTwitch, resetTwitch] = useResettableState(music.sources.twitch);
    const [bandcamp, setBandcamp, resetBandcamp] = useResettableState(music.sources.bandcamp);
    const [vimeo, setVimeo, resetVimeo] = useResettableState(music.sources.vimeo);

    const toObject = (): GuildSettingsMusic => ({
        enabled,
        web_panel: webPanel,
        sources: {
            youtube,
            niconico,
            soundcloud,
            twitch,
            bandcamp,
            vimeo
        }
    });

    const handleActionSave = () => saveGuildSettings(
        guild.id,
        {
            music: toObject()
        }
    );

    const handleActionCancel = () => {
        resetEnabled();
        resetWebPanel();
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
                    <Typography variant="body1">{translations.music_description}</Typography>
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
                open={!deepEqual(music, toObject(), { strict: true })}
                onSave={handleActionSave}
                onCancel={handleActionCancel}
            />
        </PageContent>
    );
};
