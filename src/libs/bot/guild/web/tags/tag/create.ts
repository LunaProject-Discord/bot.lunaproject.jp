import { CreateGuildWebTag, GuildWebTag } from '@/interfaces/bot';
import { getGuildWebTag } from '@/libs/bot';
import prisma from '@/libs/prisma';
import { ulid } from 'ulid';

export const createGuildWebTag = async (guildId: string, data: CreateGuildWebTag): Promise<GuildWebTag> => {
    const guildWebTag = await prisma.guild_web_tags.create({
        data: {
            id: ulid(),
            guild_id: BigInt(guildId),
            slug: data.slug || undefined,
            color: data.color,
            name: data.name,
            description: data.description,
            updated_at: new Date(),
            created_at: new Date()
        }
    });

    return (await getGuildWebTag(guildWebTag))!;
};
