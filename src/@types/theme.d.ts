import '@emotion/react';
import { Theme as DiscordTheme } from '../styles/discord/Theme';

declare module '@emotion/react' {
    interface Theme extends DiscordTheme {

    }
}
