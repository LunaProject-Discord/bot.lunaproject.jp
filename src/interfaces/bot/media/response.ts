import { RedisUser } from '@interfaces/redis';
import { WebSocketResponseType } from '@interfaces/websocket';

export interface MediaResponse {
    type: WebSocketResponseType | 'status' | 'player' | 'queue' | 'play_track' | 'play_tracks' | 'play_suggestions' | 'stop';
}

export interface StatusResponse extends MediaResponse {
    type: 'status';
    guild?: StatusGuild;
    channel?: StatusChannel;
    player?: PlayerResponse;
}

export interface StatusGuild {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    splash?: string;
    banner?: string;
    features: string[];
}

export interface StatusChannel {
    id: string;
    type: number;
    name: string;
    topic?: string;
    nsfw?: boolean;
}

export interface PlayerResponse extends MediaResponse {
    type: 'player';
    volume: number;
    loop_type: PlayerLoopType;
    position?: string;
    paused?: boolean;
    playing_track?: PlayingTrack;
    queue: QueueResponse;
}

export type PlayerLoopType = 'ALL' | 'SINGLE' | 'NONE';

export interface PlayingTrack {
    id: string;
    title: string;
    url?: string;
    artworkUrl?: string;
    author: string;
    duration: string;
    seekable: boolean;
    stream: boolean;
    source: string;
    identifier: string;
}

export interface QueueResponse extends MediaResponse {
    type: 'queue';
    tracks: QueuedTrack[];
}

export interface QueuedTrack extends PlayingTrack {
    member: QueueMember;
}

export interface QueueMember {
    id: string;
    user: RedisUser;
    nick?: string;
    avatar?: string;
    permissions: string;
}

export interface StopResponse extends MediaResponse {
    type: 'stop';
}
