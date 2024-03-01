import { SessionStatus } from '@/interfaces/bot';
import { DateTime } from 'luxon';

export interface Statistics {
    total: number;
    period: StatisticsPeriod;
    statistics: Statistic[];
}

export interface StatisticsPeriod {
    type: StatisticsPeriodType;
    startedAt: number;
    endedAt: number;
}

export interface StatisticsPeriodData extends Pick<StatisticsPeriod, 'type'> {
    startedAt?: DateTime;
    endedAt?: DateTime;
}

export type StatisticsPeriodType = 'hours' | 'days' | 'weeks' | 'months';

export interface Statistic {
    id: number;
    statuses: StatisticStatuses;
    pings: StatisticData;
    guilds: StatisticData;
    channels: StatisticChannels;
    roles: StatisticData;
    emojis: StatisticData;
    users: StatisticUsers;
    updatedAt: number;
    createdAt: number;
}

export interface StatisticStatuses {
    total: number;
    running: number;
    queued: number;
    shards: Record<number, SessionStatus>;
}

export interface StatisticData {
    total: number;
    shards: Record<number, number>;
}

export interface StatisticChannels extends StatisticChannelsData {
    shards: Record<number, StatisticChannelsData>;
}

export interface StatisticChannelsData {
    total: number;
    categories: number;
    textChannels: number;
    voiceChannels: number;
    announcementChannels: number;
    stageChannels: number;
    forumChannels: number;
    threads: number;
}

export interface StatisticUsers extends StatisticUsersData {
    shards: Record<number, StatisticUsersData>;
}

export interface StatisticUsersData {
    total: number;
    users: number;
    bots: number;
}
