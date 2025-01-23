import { drizzle } from 'drizzle-orm/mysql2';
import * as relations from './relations';
import * as schema from './schema';

export const database = drizzle(
    {
        connection: {
            uri: process.env.DATABASE_URL!,
            supportBigNumbers: true,
            bigNumberStrings: true
        },
        schema: { ...schema, ...relations },
        mode: 'default'
    }
);

export * from './relations';
export * from './schema';
export * from './types';
