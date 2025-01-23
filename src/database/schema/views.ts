import { DatabaseSystemStatisticChannels } from '@/database';
import { StatisticData, StatisticStatuses, StatisticUsers } from '@/interfaces/bot';
import { sql } from 'drizzle-orm';
import { bigint, int, json, mysqlView, varchar } from 'drizzle-orm/mysql-core';
import {
    COLUMN_NAME_GUILD_ID,
    COLUMN_NAME_ID,
    COLUMN_NAME_USER_ID,
    COLUMN_TYPE_CREATED_AT,
    COLUMN_TYPE_UPDATED_AT
} from './utils';

export const Guild_Levels_With_Rank = mysqlView(
    'guild_levels_with_rank',
    {
        guildId: bigint(COLUMN_NAME_GUILD_ID, { mode: 'bigint' }).notNull(),
        userId: bigint(COLUMN_NAME_USER_ID, { mode: 'bigint' }).notNull(),
        rank: bigint('rank', { mode: 'number' }).notNull(),
        level: bigint('level', { mode: 'number' }).notNull(),
        experience: bigint('experience', { mode: 'number' }).notNull(),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    }
)
    .algorithm('undefined')
    .sqlSecurity('definer')
    .as(
        sql`
            select \`A\`.\`guild_id\`   AS \`guild_id\`,
                   \`A\`.\`user_id\`    AS \`user_id\`,
                   \`b\`.\`rank\`       AS \`rank\`,
                   \`A\`.\`level\`      AS \`level\`,
                   \`A\`.\`experience\` AS \`experience\`,
                   \`A\`.\`updated_at\` AS \`updated_at\`,
                   \`A\`.\`created_at\` AS \`created_at\`
            from (\`lunaproject_yudzuki\`.\`guild_levels\` \`A\` join (select \`lunaproject_yudzuki\`.\`guild_levels\`.\`guild_id\`                                                                                                                                                           AS \`guild_id\`,
                                                                              \`lunaproject_yudzuki\`.\`guild_levels\`.\`user_id\`                                                                                                                                                            AS \`user_id\`,
                                                                              rank() over ( partition by \`lunaproject_yudzuki\`.\`guild_levels\`.\`guild_id\` order by \`lunaproject_yudzuki\`.\`guild_levels\`.\`level\` desc,\`lunaproject_yudzuki\`.\`guild_levels\`.\`experience\` desc) AS \`rank\`
                                                                       from \`lunaproject_yudzuki\`.\`guild_levels\`) \`B\`
                  on (\`A\`.\`guild_id\` = \`b\`.\`guild_id\` and
                      \`A\`.\`user_id\` = \`b\`.\`user_id\`))
            order by \`b\`.\`rank\`, \`A\`.\`user_id\`
        `
    );

export const System_Statistics_Days = mysqlView(
    'system_statistics_days',
    {
        id: int(COLUMN_NAME_ID).default(0).notNull(),
        groupBy: varchar('group_by', { length: 10 }).default('NULL'),
        statuses: json('statuses').$type<StatisticStatuses>().notNull(),
        pings: json('pings').$type<StatisticData>().notNull(),
        guilds: json('guilds').$type<StatisticData>().notNull(),
        channels: json('channels').$type<DatabaseSystemStatisticChannels>().notNull(),
        roles: json('roles').$type<StatisticData>().notNull(),
        emojis: json('emojis').$type<StatisticData>().notNull(),
        users: json('users').$type<StatisticUsers>().notNull(),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    }
)
    .algorithm('undefined')
    .sqlSecurity('definer')
    .as(
        sql`
            select \`A\`.\`id\`                                  AS \`id\`,
                   date_format(\`A\`.\`created_at\`, '%Y-%m-%d') AS \`group_by\`,
                   \`A\`.\`statuses\`                            AS \`statuses\`,
                   \`A\`.\`pings\`                               AS \`pings\`,
                   \`A\`.\`guilds\`                              AS \`guilds\`,
                   \`A\`.\`channels\`                            AS \`channels\`,
                   \`A\`.\`roles\`                               AS \`roles\`,
                   \`A\`.\`emojis\`                              AS \`emojis\`,
                   \`A\`.\`users\`                               AS \`users\`,
                   \`A\`.\`updated_at\`                          AS \`updated_at\`,
                   \`A\`.\`created_at\`                          AS \`created_at\`
            from (\`lunaproject_yudzuki\`.\`system_statistics\` \`A\` join (select max(\`lunaproject_yudzuki\`.\`system_statistics\`.\`id\`)         AS \`id\`,
                                                                                   max(\`lunaproject_yudzuki\`.\`system_statistics\`.\`created_at\`) AS \`created_at\`
                                                                            from \`lunaproject_yudzuki\`.\`system_statistics\`
                                                                            group by date_format(
                                                                                         \`lunaproject_yudzuki\`.\`system_statistics\`.\`created_at\`,
                                                                                         '%Y-%m-%d')) \`B\`
                  on (\`A\`.\`id\` = \`b\`.\`id\`))
        `
    );

export const System_Statistics_Hours = mysqlView(
    'system_statistics_hours',
    {
        id: int(COLUMN_NAME_ID).default(0).notNull(),
        groupBy: varchar('group_by', { length: 24 }).default('NULL'),
        statuses: json('statuses').$type<StatisticStatuses>().notNull(),
        pings: json('pings').$type<StatisticData>().notNull(),
        guilds: json('guilds').$type<StatisticData>().notNull(),
        channels: json('channels').$type<DatabaseSystemStatisticChannels>().notNull(),
        roles: json('roles').$type<StatisticData>().notNull(),
        emojis: json('emojis').$type<StatisticData>().notNull(),
        users: json('users').$type<StatisticUsers>().notNull(),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    }
)
    .algorithm('undefined')
    .sqlSecurity('definer')
    .as(
        sql`
            select \`A\`.\`id\`                                           AS \`id\`,
                   date_format(\`A\`.\`created_at\`, '%Y-%m-%d %H:00:00') AS \`group_by\`,
                   \`A\`.\`statuses\`                                     AS \`statuses\`,
                   \`A\`.\`pings\`                                        AS \`pings\`,
                   \`A\`.\`guilds\`                                       AS \`guilds\`,
                   \`A\`.\`channels\`                                     AS \`channels\`,
                   \`A\`.\`roles\`                                        AS \`roles\`,
                   \`A\`.\`emojis\`                                       AS \`emojis\`,
                   \`A\`.\`users\`                                        AS \`users\`,
                   \`A\`.\`updated_at\`                                   AS \`updated_at\`,
                   \`A\`.\`created_at\`                                   AS \`created_at\`
            from (\`lunaproject_yudzuki\`.\`system_statistics\` \`A\` join (select max(\`lunaproject_yudzuki\`.\`system_statistics\`.\`id\`)         AS \`id\`,
                                                                                   max(\`lunaproject_yudzuki\`.\`system_statistics\`.\`created_at\`) AS \`created_at\`
                                                                            from \`lunaproject_yudzuki\`.\`system_statistics\`
                                                                            group by date_format(
                                                                                         \`lunaproject_yudzuki\`.\`system_statistics\`.\`created_at\`,
                                                                                         '%Y-%m-%d %H:00:00')) \`B\`
                  on (\`A\`.\`id\` = \`b\`.\`id\`))
        `
    );

export const System_Statistics_Months = mysqlView(
    'system_statistics_months',
    {
        id: int(COLUMN_NAME_ID).default(0).notNull(),
        groupBy: varchar('group_by', { length: 7 }).default('NULL'),
        statuses: json('statuses').$type<StatisticStatuses>().notNull(),
        pings: json('pings').$type<StatisticData>().notNull(),
        guilds: json('guilds').$type<StatisticData>().notNull(),
        channels: json('channels').$type<DatabaseSystemStatisticChannels>().notNull(),
        roles: json('roles').$type<StatisticData>().notNull(),
        emojis: json('emojis').$type<StatisticData>().notNull(),
        users: json('users').$type<StatisticUsers>().notNull(),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    }
)
    .algorithm('undefined')
    .sqlSecurity('definer')
    .as(
        sql`
            select \`A\`.\`id\`                               AS \`id\`,
                   date_format(\`A\`.\`created_at\`, '%Y-%m') AS \`group_by\`,
                   \`A\`.\`statuses\`                         AS \`statuses\`,
                   \`A\`.\`pings\`                            AS \`pings\`,
                   \`A\`.\`guilds\`                           AS \`guilds\`,
                   \`A\`.\`channels\`                         AS \`channels\`,
                   \`A\`.\`roles\`                            AS \`roles\`,
                   \`A\`.\`emojis\`                           AS \`emojis\`,
                   \`A\`.\`users\`                            AS \`users\`,
                   \`A\`.\`updated_at\`                       AS \`updated_at\`,
                   \`A\`.\`created_at\`                       AS \`created_at\`
            from (\`lunaproject_yudzuki\`.\`system_statistics\` \`A\` join (select max(\`lunaproject_yudzuki\`.\`system_statistics\`.\`id\`)         AS \`id\`,
                                                                                   max(\`lunaproject_yudzuki\`.\`system_statistics\`.\`created_at\`) AS \`created_at\`
                                                                            from \`lunaproject_yudzuki\`.\`system_statistics\`
                                                                            group by date_format(
                                                                                         \`lunaproject_yudzuki\`.\`system_statistics\`.\`created_at\`,
                                                                                         '%Y-%m')) \`B\`
                  on (\`A\`.\`id\` = \`b\`.\`id\`))
        `
    );

export const System_Statistics_Weeks = mysqlView(
    'system_statistics_weeks',
    {
        id: int(COLUMN_NAME_ID).default(0).notNull(),
        groupBy: varchar('group_by', { length: 7 }).default('NULL'),
        statuses: json('statuses').$type<StatisticStatuses>().notNull(),
        pings: json('pings').$type<StatisticData>().notNull(),
        guilds: json('guilds').$type<StatisticData>().notNull(),
        channels: json('channels').$type<DatabaseSystemStatisticChannels>().notNull(),
        roles: json('roles').$type<StatisticData>().notNull(),
        emojis: json('emojis').$type<StatisticData>().notNull(),
        users: json('users').$type<StatisticUsers>().notNull(),
        updatedAt: COLUMN_TYPE_UPDATED_AT,
        createdAt: COLUMN_TYPE_CREATED_AT
    }
)
    .algorithm('undefined')
    .sqlSecurity('definer')
    .as(
        sql`
            select \`A\`.\`id\`                               AS \`id\`,
                   date_format(\`A\`.\`created_at\`, '%Y-%U') AS \`group_by\`,
                   \`A\`.\`statuses\`                         AS \`statuses\`,
                   \`A\`.\`pings\`                            AS \`pings\`,
                   \`A\`.\`guilds\`                           AS \`guilds\`,
                   \`A\`.\`channels\`                         AS \`channels\`,
                   \`A\`.\`roles\`                            AS \`roles\`,
                   \`A\`.\`emojis\`                           AS \`emojis\`,
                   \`A\`.\`users\`                            AS \`users\`,
                   \`A\`.\`updated_at\`                       AS \`updated_at\`,
                   \`A\`.\`created_at\`                       AS \`created_at\`
            from (\`lunaproject_yudzuki\`.\`system_statistics\` \`A\` join (select max(\`lunaproject_yudzuki\`.\`system_statistics\`.\`id\`)         AS \`id\`,
                                                                                   max(\`lunaproject_yudzuki\`.\`system_statistics\`.\`created_at\`) AS \`created_at\`
                                                                            from \`lunaproject_yudzuki\`.\`system_statistics\`
                                                                            group by date_format(
                                                                                         \`lunaproject_yudzuki\`.\`system_statistics\`.\`created_at\`,
                                                                                         '%Y-%U')) \`B\`
                  on (\`A\`.\`id\` = \`b\`.\`id\`))
        `
    );
