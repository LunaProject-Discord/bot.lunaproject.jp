import { GuildFlags, UserFlags } from '@/interfaces/bot';

export type DatabaseGuildFlags = Omit<GuildFlags, 'id'>;

export type DatabaseUserFlags = Pick<UserFlags, 'verified' | 'partner' | 'tester'> & { bug_hunter: boolean; };

export interface DatabaseSystemStatisticChannels extends DatabaseSystemStatisticChannelsData {
    shards: Record<number, DatabaseSystemStatisticChannelsData>;
}

export interface DatabaseSystemStatisticChannelsData {
    total: number;
    categories: number;
    text_channels: number;
    voice_channels: number;
    announcement_channels: number;
    stage_channels: number;
    forum_channels: number;
    threads: number;
}
