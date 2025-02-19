import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as relations from './relations';
import * as schema from './schema';

const poolConnection = mysql.createPool({
    uri: process.env.DATABASE_URI!,
    supportBigNumbers: true,
    bigNumberStrings: true
});

export const database = drizzle(
    {
        client: poolConnection,
        schema: { ...schema, ...relations },
        mode: 'default'
    }
);

export * from './relations';
export * from './schema';
export * from './types';
