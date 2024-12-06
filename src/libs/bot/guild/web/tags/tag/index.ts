import { GuildWebTag } from '@/interfaces/bot';
import prisma, { guild_web_tags } from '@/libs/prisma';

export const getGuildWebTag = async (tagOrId: guild_web_tags | string): Promise<GuildWebTag | undefined> => {
    const guildWebTag = typeof tagOrId === 'string' ? await prisma.guild_web_tags.findUnique({ where: { id: tagOrId } }) : tagOrId;
    if (!guildWebTag)
        return undefined;

    return {
        id: guildWebTag.id,
        guildId: guildWebTag.guild_id.toString(),
        slug: guildWebTag.slug || undefined,
        color: guildWebTag.color,
        name: guildWebTag.name,
        description: guildWebTag.description,
        updatedAt: guildWebTag.updated_at,
        createdAt: guildWebTag.created_at
    };
};

export * from './create';
export * from './delete';
export * from './update';
