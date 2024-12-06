import { CreateGuildWebCategory, GuildWebCategory } from '@/interfaces/bot';
import { getGuildWebCategory } from '@/libs/bot';
import prisma from '@/libs/prisma';
import { ulid } from 'ulid';

export const createGuildWebCategory = async (guildId: string, data: CreateGuildWebCategory): Promise<GuildWebCategory> => {
    const guildWebCategory = await prisma.guild_web_categories.create({
        data: {
            id: ulid(),
            guild_id: BigInt(guildId),
            slug: data.slug || undefined,
            color: data.color,
            name: data.name,
            description: data.description,
            parent_id: data.parentId,
            updated_at: new Date(),
            created_at: new Date()
        }
    });

    return (await getGuildWebCategory(guildWebCategory))!;
};
