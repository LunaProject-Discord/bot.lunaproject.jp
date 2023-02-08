import '@emotion/react';
import { Theme as DiscordTheme } from '@lunaproject-discord/web-core';

declare module '@emotion/react' {
    interface Theme extends DiscordTheme {

    }
}
