import { OAuthGuild } from '@lunaproject-discord/web-discord';

export interface GuildFlags {
    id: string;
    verified: boolean;
    partner: boolean;
    tester: boolean;
}

export interface FeaturedGuild {
    guild: OAuthGuild;
    features: GuildFeature[];
}

export type GuildFeature = 'manage' | 'level';

export * from './configuration';
export * from './level';
export * from './notification';
