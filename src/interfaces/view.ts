import { GuildSettings } from './bot';
import { OAuthGuild } from './discord';
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
