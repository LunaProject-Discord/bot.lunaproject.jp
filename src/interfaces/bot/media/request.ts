export interface MediaRequest {
    type: 'status' | 'player' | 'play' | 'pause' | 'resume' | 'stop' | 'seek' | 'skip';
}

export interface StatusRequest extends MediaRequest {
    type: 'status';
}

export interface PlayerRequest extends MediaRequest {
    type: 'player';
}

export interface PlayRequest extends MediaRequest {
    type: 'play';
    keyword: string;
}

export interface PauseRequest extends MediaRequest {
    type: 'pause';
}

export interface ResumeRequest extends MediaRequest {
    type: 'resume';
}

export interface StopRequest extends MediaRequest {
    type: 'stop';
}

export interface SeekRequest extends MediaRequest {
    type: 'seek';
    position: string;
}

export interface SkipRequest extends MediaRequest {
    type: 'skip';
    mode: 'PREVIOUS' | 'NEXT';
}
