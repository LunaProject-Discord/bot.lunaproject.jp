export interface PartialUser {
    id: string;
    name?: string;
    discriminator?: string;
    avatar?: string;
}

export * from './calendar';
export * from './configuration';
export * from './notification';
