import { OAuthGuild } from '@lunaproject-discord/web-discord';
import { GuildSettings } from './bot';
import { Translation } from './language';

export interface TranslatableViewProps {
    translations: Translation;
}

export interface GuildViewProps extends TranslatableViewProps {
    guild: OAuthGuild;
}

export interface GuildSettingsViewProps extends GuildViewProps {
    settings: GuildSettings;
}
