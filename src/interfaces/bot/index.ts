export interface Prohibit {
    enabled: boolean;
    type: 'HARASSMENT' | 'SPOOFING' | 'SPAMMING' | 'ADVERTISING' | 'GLITCH' | 'LAW_VIOLATION' | 'CRIME' | 'CUSTOM';
    reason: string | null;
    expired_at: string | null;
}

export * from './calendar';
export * from './configuration';
export * from './guild';
export * from './system';
export * from './user';
