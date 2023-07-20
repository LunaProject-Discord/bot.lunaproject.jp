export interface PartialUser {
    id: string;
    name?: string;
    discriminator?: string;
    avatar?: string;
}

export interface UserFlags {
    id: string;
    manager: boolean;
    verified: boolean;
    partner: boolean;
    tester: boolean;
    bugHunter: boolean;
}

export * from './calendar';
export * from './configuration';
export * from './notification';
