import {
    Guild_Configurations,
    Guild_Dictionaries,
    Guild_Levels,
    Guild_Notification_Reads,
    Guild_Notifications,
    Guild_Punishment_Bans,
    Guild_Punishment_Mutes,
    Guild_Punishment_Warns,
    Guild_Web_Categories,
    Guild_Web_Page_Category,
    Guild_Web_Page_Contents,
    Guild_Web_Page_Tags,
    Guild_Web_Pages,
    Guild_Web_Tags,
    Guilds,
    System_Notifications,
    User_Configurations,
    User_Notifications,
    Users
} from '@/database/schema/tables';
import { relations } from 'drizzle-orm/relations';

export const guildConfigurationsRelations = relations(Guild_Configurations, ({ one }) => ({
    guild: one(Guilds, {
        fields: [Guild_Configurations.guildId],
        references: [Guilds.id]
    })
}));

export const guildsRelations = relations(Guilds, ({ one, many }) => ({
    guildConfiguration: one(Guild_Configurations),
    guildDictionaries: many(Guild_Dictionaries),
    guildLevels: many(Guild_Levels),
    guildNotifications: many(Guild_Notifications),
    guildNotificationReads: many(Guild_Notification_Reads),
    guildPunishmentBans: many(Guild_Punishment_Bans),
    guildPunishmentMutes: many(Guild_Punishment_Mutes),
    guildPunishmentWarns: many(Guild_Punishment_Warns),
    guildWebCategories: many(Guild_Web_Categories),
    guildWebPages: many(Guild_Web_Pages),
    guildWebTags: many(Guild_Web_Tags)
}));

export const guildDictionariesRelations = relations(Guild_Dictionaries, ({ one }) => ({
    guild: one(Guilds, {
        fields: [Guild_Dictionaries.guildId],
        references: [Guilds.id]
    })
}));

export const guildLevelsRelations = relations(Guild_Levels, ({ one }) => ({
    guild: one(Guilds, {
        fields: [Guild_Levels.guildId],
        references: [Guilds.id]
    }),
    user: one(Users, {
        fields: [Guild_Levels.userId],
        references: [Users.id]
    })
}));

export const usersRelations = relations(Users, ({ one, many }) => ({
    guildLevels: many(Guild_Levels),
    guildNotificationReads: many(Guild_Notification_Reads),
    guildWebPageContents: many(Guild_Web_Page_Contents),
    userConfiguration: one(User_Configurations),
    userNotifications: many(User_Notifications)
}));

export const systemNotificationsRelations = relations(System_Notifications, ({ many }) => ({
    guildNotifications: many(Guild_Notifications),
    guildNotificationReads: many(Guild_Notification_Reads),
    userNotifications: many(User_Notifications)
}));

export const guildNotificationsRelations = relations(Guild_Notifications, ({ one, many }) => ({
    guild: one(Guilds, {
        fields: [Guild_Notifications.guildId],
        references: [Guilds.id]
    }),
    systemNotification: one(System_Notifications, {
        fields: [Guild_Notifications.notificationId],
        references: [System_Notifications.id]
    })
}));

export const guildNotificationReadsRelations = relations(Guild_Notification_Reads, ({ one }) => ({
    guild: one(Guilds, {
        fields: [Guild_Notification_Reads.guildId],
        references: [Guilds.id]
    }),
    systemNotification: one(System_Notifications, {
        fields: [Guild_Notification_Reads.notificationId],
        references: [System_Notifications.id]
    }),
    user: one(Users, {
        fields: [Guild_Notification_Reads.userId],
        references: [Users.id]
    })
}));

export const guildPunishmentBansRelations = relations(Guild_Punishment_Bans, ({ one }) => ({
    guild: one(Guilds, {
        fields: [Guild_Punishment_Bans.guildId],
        references: [Guilds.id]
    })
}));

export const guildPunishmentMutesRelations = relations(Guild_Punishment_Mutes, ({ one }) => ({
    guild: one(Guilds, {
        fields: [Guild_Punishment_Mutes.guildId],
        references: [Guilds.id]
    })
}));

export const guildPunishmentWarnsRelations = relations(Guild_Punishment_Warns, ({ one }) => ({
    guild: one(Guilds, {
        fields: [Guild_Punishment_Warns.guildId],
        references: [Guilds.id]
    })
}));

export const guildWebCategoriesRelations = relations(Guild_Web_Categories, ({ one, many }) => ({
    guild: one(Guilds, {
        fields: [Guild_Web_Categories.guildId],
        references: [Guilds.id]
    }),
    parentGuildWebCategory: one(Guild_Web_Categories, {
        fields: [Guild_Web_Categories.parentId],
        references: [Guild_Web_Categories.id],
        relationName: 'guildWebCategories_parentId_guildWebCategories_id'
    }),
    guildWebCategories: many(Guild_Web_Categories, {
        relationName: 'guildWebCategories_parentId_guildWebCategories_id'
    }),
    guildWebPageCategories: many(Guild_Web_Page_Category)
}));

export const guildWebPagesRelations = relations(Guild_Web_Pages, ({ one, many }) => ({
    guildWebPageContent: one(Guild_Web_Page_Contents, {
        fields: [Guild_Web_Pages.contentId],
        references: [Guild_Web_Page_Contents.id],
        relationName: 'guildWebPages_contentId_guildWebPageContents_id'
    }),
    guild: one(Guilds, {
        fields: [Guild_Web_Pages.guildId],
        references: [Guilds.id]
    }),
    guildWebPageCategory: one(Guild_Web_Page_Category),
    guildWebPageContents: many(Guild_Web_Page_Contents, {
        relationName: 'guildWebPageContents_pageId_guildWebPages_id'
    }),
    guildWebPageTags: many(Guild_Web_Page_Tags)
}));

export const guildWebPageContentsRelations = relations(Guild_Web_Page_Contents, ({ one, many }) => ({
    guildWebPages: many(Guild_Web_Pages, {
        relationName: 'guildWebPages_contentId_guildWebPageContents_id'
    }),
    guildWebPage: one(Guild_Web_Pages, {
        fields: [Guild_Web_Page_Contents.pageId],
        references: [Guild_Web_Pages.id],
        relationName: 'guildWebPageContents_pageId_guildWebPages_id'
    }),
    user: one(Users, {
        fields: [Guild_Web_Page_Contents.userId],
        references: [Users.id]
    })
}));

export const guildWebPageCategoryRelations = relations(Guild_Web_Page_Category, ({ one }) => ({
    guildWebCategory: one(Guild_Web_Categories, {
        fields: [Guild_Web_Page_Category.categoryId],
        references: [Guild_Web_Categories.id]
    }),
    guildWebPage: one(Guild_Web_Pages, {
        fields: [Guild_Web_Page_Category.pageId],
        references: [Guild_Web_Pages.id]
    })
}));

export const guildWebPageTagsRelations = relations(Guild_Web_Page_Tags, ({ one }) => ({
    guildWebPage: one(Guild_Web_Pages, {
        fields: [Guild_Web_Page_Tags.pageId],
        references: [Guild_Web_Pages.id]
    }),
    guildWebTag: one(Guild_Web_Tags, {
        fields: [Guild_Web_Page_Tags.tagId],
        references: [Guild_Web_Tags.id]
    })
}));

export const guildWebTagsRelations = relations(Guild_Web_Tags, ({ one, many }) => ({
    guildWebPageTags: many(Guild_Web_Page_Tags),
    guild: one(Guilds, {
        fields: [Guild_Web_Tags.guildId],
        references: [Guilds.id]
    })
}));

export const userConfigurationsRelations = relations(User_Configurations, ({ one }) => ({
    user: one(Users, {
        fields: [User_Configurations.userId],
        references: [Users.id]
    })
}));

export const userNotificationsRelations = relations(User_Notifications, ({ one }) => ({
    systemNotification: one(System_Notifications, {
        fields: [User_Notifications.notificationId],
        references: [System_Notifications.id]
    }),
    user: one(Users, {
        fields: [User_Notifications.userId],
        references: [Users.id]
    })
}));
