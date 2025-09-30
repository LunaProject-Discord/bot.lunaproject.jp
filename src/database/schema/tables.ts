import { DatabaseGuildFlags, DatabaseSystemStatisticChannels, DatabaseUserFlags } from '@/database';
import {
    ConfigurationRoot,
    GuildConfigurationActivity,
    GuildConfigurationCommands,
    GuildConfigurationGlobalBan,
    GuildConfigurationGoodbye,
    GuildConfigurationLevel,
    GuildConfigurationLogging,
    GuildConfigurationMemberJoin,
    GuildConfigurationMusic,
    GuildConfigurationQuote,
    GuildConfigurationTranslate,
    GuildConfigurationVote,
    Prohibit,
    StatisticData,
    StatisticStatuses,
    StatisticUsers,
    UserConfigurationTranslate
} from '@/interfaces/bot';
import { JSONContent } from '@tiptap/core';
import {
    AnyMySqlColumn,
    bigint,
    binary,
    boolean,
    char,
    datetime,
    double,
    int,
    json,
    longtext,
    mysqlEnum,
    mysqlTable,
    primaryKey,
    text,
    unique,
    varchar
} from 'drizzle-orm/mysql-core';
import {
    COLUMN_NAME_DELETED_AT,
    COLUMN_NAME_ID,
    COLUMN_NAME_USER_ID,
    COLUMN_TYPE_CREATED_AT,
    COLUMN_TYPE_GUILD_ID,
    COLUMN_TYPE_ULID,
    COLUMN_TYPE_UPDATED_AT,
    COLUMN_TYPE_USER_ID,
    INDEX_NAME_PRIMARY_KEY,
    INDEX_NAME_UNIQUE_KEY
} from './utils';

// サーバー
export const Guilds = mysqlTable(
    'guilds',
    {
        id: bigint(COLUMN_NAME_ID, { mode: 'bigint' }).notNull().primaryKey(),
        flags: json('flags').$type<DatabaseGuildFlags>().notNull(),
        prohibit: json('prohibit').$type<Prohibit>().notNull(),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    },
    (table) => [
        primaryKey({ name: INDEX_NAME_PRIMARY_KEY, columns: [table.id] })
    ]
);

export const Guild_Configurations = mysqlTable(
    'guild_configurations',
    {
        guildId: COLUMN_TYPE_GUILD_ID,
        prefix: varchar('prefix', { length: 32 }).default('s#').notNull(),
        nickname: varchar('nickname', { length: 32 }).default('[%p] %n').notNull(),
        language: varchar('language', { length: 8 }).default('ja-JP').notNull(),
        timezone: varchar('timezone', { length: 32 }).default('Asia/Tokyo').notNull(),
        commands: json('commands').$type<GuildConfigurationCommands>().notNull(),
        memberJoin: json('member_join').$type<GuildConfigurationMemberJoin>().notNull(),
        goodbye: json('goodbye').$type<GuildConfigurationGoodbye>().notNull(),
        activity: json('activity').$type<GuildConfigurationActivity>().notNull(),
        globalChat: json('global_chat').$type<ConfigurationRoot>().notNull(),
        globalBan: json('global_ban').$type<GuildConfigurationGlobalBan>().notNull(),
        level: json('level').$type<GuildConfigurationLevel>().notNull(),
        translate: json('translate').$type<GuildConfigurationTranslate>().notNull(),
        vote: json('vote').$type<GuildConfigurationVote>().notNull(),
        quote: json('quote').$type<GuildConfigurationQuote>().notNull(),
        music: json('music').$type<GuildConfigurationMusic>().notNull(),
        textToSpeech: longtext('text_to_speech').default('{"enabled":false,"dictionaries":[],"plan":"TIER_0","remaining_standard_count":10000,"remaining_wavenet_count":5000}').notNull(),
        logging: json('logging').$type<GuildConfigurationLogging>().notNull(),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    },
    (table) => [
        primaryKey({ name: INDEX_NAME_PRIMARY_KEY, columns: [table.guildId] })
    ]
);

export const Guild_Dictionaries = mysqlTable(
    'guild_dictionaries',
    {
        guildId: COLUMN_TYPE_GUILD_ID,
        from: varchar('from', { length: 64 }).notNull(),
        to: varchar('to', { length: 64 }).notNull(),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    },
    (table) => [
        primaryKey({ name: INDEX_NAME_PRIMARY_KEY, columns: [table.guildId, table.from] })
    ]
);

export const Guild_Levels = mysqlTable(
    'guild_levels',
    {
        guildId: COLUMN_TYPE_GUILD_ID,
        userId: COLUMN_TYPE_USER_ID,
        level: bigint('level', { mode: 'number' }).notNull(),
        experience: bigint('experience', { mode: 'number' }).notNull(),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    },
    (table) => [
        primaryKey({ name: INDEX_NAME_PRIMARY_KEY, columns: [table.guildId, table.userId] })
    ]
);

export const Guild_Notifications = mysqlTable(
    'guild_notifications',
    {
        guildId: COLUMN_TYPE_GUILD_ID,
        notificationId: char('notification_id', { length: 26 })
            .notNull()
            .references(() => System_Notifications.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    },
    (table) => [
        primaryKey({ name: INDEX_NAME_PRIMARY_KEY, columns: [table.guildId, table.notificationId] })
    ]
);

export const Guild_Notification_Reads = mysqlTable(
    'guild_notification_reads',
    {
        guildId: COLUMN_TYPE_GUILD_ID,
        notificationId: char('notification_id', { length: 26 })
            .notNull()
            .references(() => System_Notifications.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
        userId: COLUMN_TYPE_USER_ID,
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    },
    (table) => [
        primaryKey({ name: INDEX_NAME_PRIMARY_KEY, columns: [table.guildId, table.notificationId, table.userId] })
    ]
);

export const Guild_Punishment_Bans = mysqlTable(
    'guild_punishment_bans',
    {
        id: binary(COLUMN_NAME_ID, { length: 16 }).notNull(),
        guildId: COLUMN_TYPE_GUILD_ID,
        userId: bigint(COLUMN_NAME_USER_ID, { mode: 'bigint' }).notNull(),
        byUserId: bigint('by_user_id', { mode: 'bigint' }).notNull(),
        reason: text('reason').notNull(),
        isActive: boolean('is_active').default(true).notNull(),
        expiredAt: datetime('expired_at', { mode: 'string' }).$type<string | null>().$default(() => null),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    },
    (table) => [
        primaryKey({ name: INDEX_NAME_PRIMARY_KEY, columns: [table.id] })
    ]
);

export const Guild_Punishment_Mutes = mysqlTable(
    'guild_punishment_mutes',
    {
        id: binary(COLUMN_NAME_ID, { length: 16 }).notNull(),
        guildId: COLUMN_TYPE_GUILD_ID,
        userId: bigint(COLUMN_NAME_USER_ID, { mode: 'bigint' }).notNull(),
        byUserId: bigint('by_user_id', { mode: 'bigint' }).notNull(),
        reason: text('reason').notNull(),
        isActive: boolean('is_active').default(true).notNull(),
        expiredAt: datetime('expired_at', { mode: 'string' }).$type<string | null>().$default(() => null),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    },
    (table) => [
        primaryKey({ name: INDEX_NAME_PRIMARY_KEY, columns: [table.id] })
    ]
);

export const Guild_Punishment_Warns = mysqlTable(
    'guild_punishment_warns',
    {
        id: binary(COLUMN_NAME_ID, { length: 16 }).notNull(),
        guildId: COLUMN_TYPE_GUILD_ID,
        userId: bigint(COLUMN_NAME_USER_ID, { mode: 'bigint' }).notNull(),
        byUserId: bigint('by_user_id', { mode: 'bigint' }).notNull(),
        reason: text('reason').notNull(),
        isActive: boolean('is_active').default(true).notNull(),
        expiredAt: datetime('expired_at', { mode: 'string' }).$type<string | null>().$default(() => null),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    },
    (table) => [
        primaryKey({ name: INDEX_NAME_PRIMARY_KEY, columns: [table.id] })
    ]
);

export const Guild_Web_Categories = mysqlTable(
    'guild_web_categories',
    {
        id: COLUMN_TYPE_ULID,
        guildId: COLUMN_TYPE_GUILD_ID,
        slug: varchar('slug', { length: 64 }).$type<string | null>().$default(() => null),
        color: varchar('color', { length: 9 }).default('#00000000').notNull(),
        name: varchar('name', { length: 128 }).notNull(),
        description: varchar('description', { length: 256 }).default('').notNull(),
        parentId: char('parent_id', { length: 26 })
            .$type<string | null>()
            .$default(() => null)
            .references((): AnyMySqlColumn => Guild_Web_Categories.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    },
    (table) => [
        primaryKey({ name: INDEX_NAME_PRIMARY_KEY, columns: [table.id] }),
        unique(INDEX_NAME_UNIQUE_KEY).on(table.guildId, table.slug)
    ]
);

export const Guild_Web_Pages = mysqlTable(
    'guild_web_pages',
    {
        id: COLUMN_TYPE_ULID,
        contentId: char('content_id', { length: 26 })
            .$type<string | null>()
            .$default(() => null)
            .references(() => Guild_Web_Page_Contents.id, { onDelete: 'set null', onUpdate: 'cascade' }),
        guildId: COLUMN_TYPE_GUILD_ID,
        slug: varchar({ length: 64 }).$type<string | null>().$default(() => null),
        deletedAt: datetime(COLUMN_NAME_DELETED_AT, { mode: 'string' }).$type<string | null>().$default(() => null),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    },
    (table) => [
        primaryKey({ name: INDEX_NAME_PRIMARY_KEY, columns: [table.id] }),
        unique(INDEX_NAME_UNIQUE_KEY).on(table.guildId, table.slug)
    ]
);

export const Guild_Web_Page_Category = mysqlTable(
    'guild_web_page_category',
    {
        pageId: char('page_id', { length: 26 })
            .notNull()
            .references(() => Guild_Web_Pages.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
        categoryId: char('category_id', { length: 26 })
            .notNull()
            .references(() => Guild_Web_Categories.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    },
    (table) => [
        primaryKey({ name: INDEX_NAME_PRIMARY_KEY, columns: [table.pageId] })
    ]
);

export const Guild_Web_Page_Contents = mysqlTable(
    'guild_web_page_contents',
    {
        id: COLUMN_TYPE_ULID,
        pageId: char('page_id', { length: 26 })
            .notNull()
            .references((): AnyMySqlColumn => Guild_Web_Pages.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
        userId: COLUMN_TYPE_USER_ID,
        thumbnail: text('thumbnail').$type<string | null>().$default(() => null),
        icon: varchar('icon', { length: 8 }).$type<string | null>().$default(() => null),
        title: varchar('title', { length: 128 }).notNull(),
        content: json('content').$type<JSONContent>().notNull(),
        isPublished: boolean('is_published').default(false).notNull(),
        isAutoSave: boolean('is_auto_save').default(false).notNull(),
        comment: varchar('comment', { length: 256 }).default('').notNull(),
        deletedAt: datetime(COLUMN_NAME_DELETED_AT, { mode: 'string' }).$type<string | null>().$default(() => null),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    },
    (table) => [
        primaryKey({ name: INDEX_NAME_PRIMARY_KEY, columns: [table.id] })
    ]
);

export const Guild_Web_Page_Tags = mysqlTable(
    'guild_web_page_tags',
    {
        pageId: char('page_id', { length: 26 })
            .notNull()
            .references(() => Guild_Web_Pages.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
        tagId: char('tag_id', { length: 26 })
            .notNull()
            .references(() => Guild_Web_Tags.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    },
    (table) => [
        primaryKey({ name: INDEX_NAME_PRIMARY_KEY, columns: [table.pageId, table.tagId] })
    ]
);

export const Guild_Web_Tags = mysqlTable(
    'guild_web_tags',
    {
        id: COLUMN_TYPE_ULID,
        guildId: COLUMN_TYPE_GUILD_ID,
        slug: varchar('slug', { length: 64 }).$type<string | null>().$default(() => null),
        color: varchar('color', { length: 9 }).default('#00000000').notNull(),
        name: varchar('name', { length: 64 }).notNull(),
        description: varchar('description', { length: 128 }).default('').notNull(),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    },
    (table) => [
        primaryKey({ name: INDEX_NAME_PRIMARY_KEY, columns: [table.id] }),
        unique(INDEX_NAME_UNIQUE_KEY).on(table.guildId, table.slug)
    ]
);


// システム
export const System_Logs = mysqlTable(
    'system_logs',
    {
        id: int(COLUMN_NAME_ID).autoincrement().notNull(),
        title: text('title').notNull(),
        description: longtext('description').notNull(),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    }
);

export const System_Notifications = mysqlTable(
    'system_notifications',
    {
        id: COLUMN_TYPE_ULID,
        type: mysqlEnum('type', ['success', 'warning', 'error', 'information']).notNull(),
        title: varchar('title', { length: 64 }).notNull(),
        description: text('description').notNull(),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    },
    (table) => [
        primaryKey({ name: INDEX_NAME_PRIMARY_KEY, columns: [table.id] })
    ]
);

export const System_Performances = mysqlTable(
    'system_performances',
    {
        id: int(COLUMN_NAME_ID).autoincrement().notNull(),
        runtimeCpu: double('runtime_cpu').notNull(),
        systemCpu: double('system_cpu').notNull(),
        runtimeMemoryTotal: bigint('runtime_memory_total', { mode: 'bigint' }).notNull(),
        runtimeMemoryUsed: bigint('runtime_memory_used', { mode: 'bigint' }).notNull(),
        runtimeMemoryFree: bigint('runtime_memory_free', { mode: 'bigint' }).notNull(),
        systemMemoryTotal: bigint('system_memory_total', { mode: 'bigint' }).notNull(),
        systemMemoryUsed: bigint('system_memory_used', { mode: 'bigint' }).notNull(),
        systemMemoryFree: bigint('system_memory_free', { mode: 'bigint' }).notNull(),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    },
    (table) => [
        primaryKey({ name: INDEX_NAME_PRIMARY_KEY, columns: [table.id] }),
        unique(INDEX_NAME_UNIQUE_KEY).on(table.createdAt)
    ]
);

export const System_Statistics = mysqlTable(
    'system_statistics',
    {
        id: int(COLUMN_NAME_ID).autoincrement().notNull(),
        statuses: json('statuses').$type<StatisticStatuses>().notNull(),
        pings: json('pings').$type<StatisticData>().notNull(),
        guilds: json('guilds').$type<StatisticData>().notNull(),
        channels: json('channels').$type<DatabaseSystemStatisticChannels>().notNull(),
        roles: json('roles').$type<StatisticData>().notNull(),
        emojis: json('emojis').$type<StatisticData>().notNull(),
        users: json('users').$type<StatisticUsers>().notNull(),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    },
    (table) => [
        primaryKey({ name: INDEX_NAME_PRIMARY_KEY, columns: [table.id] }),
        unique(INDEX_NAME_UNIQUE_KEY).on(table.createdAt)
    ]
);


// ユーザー
export const Users = mysqlTable(
    'users',
    {
        id: bigint(COLUMN_NAME_ID, { mode: 'bigint' }).notNull().primaryKey(),
        permission: int('permission').default(0).notNull(),
        evaluateValue: double('evaluate_value').default(10).notNull(),
        flags: json('flags').$type<DatabaseUserFlags>().notNull(),
        prohibit: json('prohibit').$type<Prohibit>().notNull(),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    },
    (table) => [
        primaryKey({ name: INDEX_NAME_PRIMARY_KEY, columns: [table.id] })
    ]
);

export const User_Configurations = mysqlTable(
    'user_configurations',
    {
        userId: COLUMN_TYPE_USER_ID,
        language: varchar('language', { length: 8 }).default('ja-JP').notNull(),
        timezone: varchar('timezone', { length: 32 }).default('Asia/Tokyo').notNull(),
        accentColor: varchar('accent_color', { length: 16 }).default('#959ac0').notNull(),
        translate: json('translate').$type<UserConfigurationTranslate>().notNull(),
        authenticator: longtext('authenticator').default('{"key":null,"verification_code":null,"scratch_codes":[]}').notNull(),
        token: text('token').notNull(),
        tokenSecret: text('token_secret').notNull(),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    },
    (table) => [
        primaryKey({ name: INDEX_NAME_PRIMARY_KEY, columns: [table.userId] })
    ]
);

export const User_Notifications = mysqlTable(
    'user_notifications',
    {
        userId: COLUMN_TYPE_USER_ID,
        notificationId: char('notification_id', { length: 26 })
            .notNull()
            .references(() => System_Notifications.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
        isRead: boolean('is_read').default(false).notNull(),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    },
    (table) => [
        primaryKey({ name: INDEX_NAME_PRIMARY_KEY, columns: [table.userId, table.notificationId] })
    ]
);

export const User_CommandLogs = mysqlTable(
    'user_command_logs',
    {
        count: int('count').autoincrement().notNull(),
        id: bigint(COLUMN_NAME_ID, { mode: 'bigint' }).notNull(),
        content: text('content').notNull(),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    },
    (table) => [
        primaryKey({ name: INDEX_NAME_PRIMARY_KEY, columns: [table.count] })
    ]
);
