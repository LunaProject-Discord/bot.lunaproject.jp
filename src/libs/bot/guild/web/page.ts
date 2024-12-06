import {
    CreateGuildWebPage,
    CreateGuildWebPageContent,
    GuildWebPage,
    GuildWebPageContent,
    UpdateGuildWebPage,
    UpdateGuildWebPageContent
} from '@/interfaces/bot';
import { getGuildWebCategoryByPageId, getGuildWebTagsByPageId } from '@/libs/bot';
import prisma, { guild_web_page_content, guild_web_page_contents, guild_web_pages } from '@/libs/prisma';
import { ulid } from 'ulid';

export const getGuildWebPages = async (guildId: string): Promise<GuildWebPage[]> => {
    const guildWebPages = await prisma.guild_web_pages.findMany({
        where: {
            guild_id: BigInt(guildId)
        },
        include: {
            guild_web_page_content: true,
            guild_web_page_contents: true
        }
    });

    const pages: GuildWebPage[] = [];
    for (const guildWebPage of guildWebPages) {
        const page = await getGuildWebPage(guildWebPage);
        if (page)
            pages.push(page);
    }

    return pages;
};

export interface PrismaGuildWebPage extends guild_web_pages {
    guild_web_page_content: guild_web_page_content | null;
    guild_web_page_contents: guild_web_page_contents[];
}

export const getGuildWebPage = async (pageOrId: PrismaGuildWebPage | string): Promise<GuildWebPage | undefined> => {
    const guildWebPage = typeof pageOrId === 'string' ? await prisma.guild_web_pages.findUnique({
        where: {
            id: pageOrId
        },
        include: {
            guild_web_page_content: true,
            guild_web_page_contents: true
        }
    }) : pageOrId;
    if (!guildWebPage)
        return undefined;

    const id = guildWebPage.id;
    const contents = await getGuildWebPageContents(id);
    const contentId = guildWebPage.guild_web_page_content?.page_content_id;

    return {
        id,
        guildId: guildWebPage.guild_id.toString(),
        slug: guildWebPage.slug || undefined,
        contentId,
        content: contentId ? contents.find(content => content.id === contentId) : undefined,
        contents,
        category: await getGuildWebCategoryByPageId(id),
        tags: await getGuildWebTagsByPageId(id),
        deletedAt: guildWebPage.deleted_at ?? undefined,
        updatedAt: guildWebPage.updated_at,
        createdAt: guildWebPage.created_at
    };
};

export const createGuildWebPage = async (guildId: string, data: CreateGuildWebPage): Promise<GuildWebPage> => {
    const guildWebPage = await prisma.guild_web_pages.create({
        data: {
            id: ulid(),
            guild_id: BigInt(guildId),
            slug: data.slug || undefined,
            guild_web_page_content: {
                create: {
                    guild_web_page_contents: {
                        connect: {
                            id: ulid(),
                            icon: data.content.icon,
                            title: data.content.title,
                            content: data.content.content,
                            is_published: data.content.published,
                            updated_at: new Date(),
                            created_at: new Date()
                        }
                    },
                    updated_at: new Date(),
                    created_at: new Date()
                }
            },
            guild_web_page_category: {
                create: {
                    guild_web_categories: {
                        connect: {
                            id: data.category
                        }
                    },
                    updated_at: new Date(),
                    created_at: new Date()
                }
            },
            guild_web_page_tags: {
                create: data.tags?.map((tagId) => ({
                    guild_web_tags: {
                        connect: {
                            id: tagId
                        }
                    },
                    updated_at: new Date(),
                    created_at: new Date()
                }))
            },
            updated_at: new Date(),
            created_at: new Date()
        },
        include: {
            guild_web_page_content: true,
            guild_web_page_contents: true
        }
    });

    return (await getGuildWebPage(guildWebPage))!;
};

export const updateGuildWebPage = async (pageId: string, data: UpdateGuildWebPage): Promise<GuildWebPage> => {
    await prisma.$transaction(async (prisma) => {
        await prisma.guild_web_pages.update({
            where: {
                id: pageId
            },
            data: {
                slug: data.slug,
                deleted_at: data.deleted ? new Date() : undefined,
                updated_at: new Date()
            }
        });

        if (data.category !== undefined) {
            if (data.category) {
                await prisma.guild_web_page_category.upsert({
                    where: {
                        page_id: pageId
                    },
                    update: {
                        category_id: data.category,
                        updated_at: new Date()
                    },
                    create: {
                        page_id: pageId,
                        category_id: data.category,
                        updated_at: new Date(),
                        created_at: new Date()
                    }
                });
            } else {
                await prisma.guild_web_page_category.delete({
                    where: {
                        page_id: pageId
                    }
                });
            }
        }

        if (data.tags !== undefined) {
            await prisma.guild_web_page_tags.deleteMany({
                where: {
                    page_id: pageId
                }
            });

            if (data.tags && data.tags.length > 0) {
                await prisma.guild_web_page_tags.createMany({
                    data: data.tags.map((tagId) => ({
                        page_id: pageId,
                        tag_id: tagId,
                        updated_at: new Date(),
                        created_at: new Date()
                    }))
                });
            }
        }
    });

    return (await getGuildWebPage(pageId))!;
};

export const deleteGuildWebPage = async (pageId: string) => {
    await prisma.guild_web_pages.delete({
        where: {
            id: pageId
        }
    });
};

export const getGuildWebPageContents = async (pageId: string): Promise<GuildWebPageContent[]> => {
    const guildWebPageContents = await prisma.guild_web_page_contents.findMany({
        where: {
            page_id: pageId
        },
        include: {
            guild_web_pages: true
        }
    });

    const contents: GuildWebPageContent[] = [];
    for (const guildWebPageContent of guildWebPageContents) {
        const content = await getGuildWebPageContent(guildWebPageContent);
        if (content)
            contents.push(content);
    }

    return contents;
};

export interface PrismaGuildWebPageContent extends guild_web_page_contents {
    guild_web_pages: guild_web_pages;
}

export const getGuildWebPageContent = async (pageContentOrId: PrismaGuildWebPageContent | string): Promise<GuildWebPageContent | undefined> => {
    const guildWebPageContent = typeof pageContentOrId === 'string' ? await prisma.guild_web_page_contents.findUnique({
        where: {
            id: pageContentOrId
        },
        include: {
            guild_web_pages: true
        }
    }) : pageContentOrId;
    if (!guildWebPageContent)
        return undefined;

    return {
        id: guildWebPageContent.id,
        guildId: guildWebPageContent.guild_web_pages.guild_id.toString(),
        pageId: guildWebPageContent.page_id,
        icon: guildWebPageContent.icon || undefined,
        title: guildWebPageContent.title,
        content: guildWebPageContent.content,
        published: guildWebPageContent.is_published,
        deletedAt: guildWebPageContent.deleted_at ?? undefined,
        updatedAt: guildWebPageContent.updated_at,
        createdAt: guildWebPageContent.created_at
    };
};

export const createGuildWebPageContent = async (pageId: string, data: CreateGuildWebPageContent): Promise<GuildWebPageContent> => {
    const guildWebPageContent = await prisma.guild_web_page_contents.create({
        data: {
            id: ulid(),
            page_id: pageId,
            icon: data.icon,
            title: data.title,
            content: data.content,
            is_published: data.published,
            updated_at: new Date(),
            created_at: new Date()
        },
        include: {
            guild_web_pages: true
        }
    });

    return (await getGuildWebPageContent(guildWebPageContent))!;
};

export const updateGuildWebPageContent = async (pageContentId: string, data: UpdateGuildWebPageContent): Promise<GuildWebPageContent> => {
    const guildWebPageContent = await prisma.guild_web_page_contents.update({
        where: {
            id: pageContentId
        },
        data: {
            is_published: data.published,
            deleted_at: data.deleted ? new Date() : undefined,
            updated_at: new Date()
        },
        include: {
            guild_web_pages: true
        }
    });

    return (await getGuildWebPageContent(guildWebPageContent))!;
};

export const deleteGuildWebPageContent = async (pageContentId: string) => {
    await prisma.guild_web_page_contents.delete({
        where: {
            id: pageContentId
        }
    });
};
