import { TimeZone } from '@utils/timezone';

export interface UserConfiguration {
    id: string;

    language: UserConfigurationLanguage;
    timezone: TimeZone;
}

export type UserConfigurationLanguage = 'ja-JP' | 'en-US';
