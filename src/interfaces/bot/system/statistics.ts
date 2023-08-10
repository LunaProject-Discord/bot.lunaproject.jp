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
    shards: Record<number, StatisticStatus>;
}

export type StatisticStatus =
    'INITIALIZING'
    | 'INITIALIZED'
    | 'LOGGING_IN'
    | 'CONNECTING_TO_WEBSOCKET'
    | 'IDENTIFYING_SESSION'
    | 'AWAITING_LOGIN_CONFIRMATION'
    | 'LOADING_SUBSYSTEMS'
    | 'CONNECTED'
    | 'DISCONNECTED'
    | 'RECONNECT_QUEUED'
    | 'WAITING_TO_RECONNECT'
    | 'ATTEMPTING_TO_RECONNECT'
    | 'SHUTTING_DOWN'
    | 'SHUTDOWN'
    | 'FAILED_TO_LOGIN';

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
