import { Guilds, Users } from '@/database';
import { toSQLDate } from '@/utils/date';
import { bigint, char, datetime } from 'drizzle-orm/mysql-core';
import { ulid } from 'ulid';

export const COLUMN_NAME_ID = 'id';
export const COLUMN_NAME_DELETED_AT = 'deleted_at';
export const COLUMN_NAME_UPDATED_AT = 'updated_at';
export const COLUMN_NAME_CREATED_AT = 'created_at';

export const COLUMN_NAME_GUILD_ID = 'guild_id';
export const COLUMN_NAME_CHANNEL_ID = 'channel_id';
export const COLUMN_NAME_ROLE_ID = 'role_id';
export const COLUMN_NAME_USER_ID = 'user_id';
export const COLUMN_NAME_MESSAGE_ID = 'message_id';


export const INDEX_NAME_PRIMARY_KEY = 'PRIMARY';
export const INDEX_NAME_UNIQUE_KEY = 'UNIQUE';


export const COLUMN_TYPE_ULID = char(COLUMN_NAME_ID, { length: 26 })
    .notNull()
    .primaryKey()
    .$defaultFn(ulid);
export const COLUMN_TYPE_UPDATED_AT = datetime(COLUMN_NAME_UPDATED_AT, { mode: 'string' })
    .notNull()
    .$defaultFn(toSQLDate)
    .$onUpdateFn(toSQLDate);
export const COLUMN_TYPE_CREATED_AT = datetime(COLUMN_NAME_CREATED_AT, { mode: 'string' })
    .notNull()
    .$defaultFn(toSQLDate);

export const COLUMN_TYPE_GUILD_ID = bigint(COLUMN_NAME_GUILD_ID, { mode: 'bigint' })
    .notNull()
    .references(() => Guilds.id, { onDelete: 'cascade', onUpdate: 'cascade' });
export const COLUMN_TYPE_USER_ID = bigint(COLUMN_NAME_USER_ID, { mode: 'bigint' })
    .notNull()
    .references(() => Users.id, { onDelete: 'cascade', onUpdate: 'cascade' });

