import { GuildWebCategory, GuildWebPage, GuildWebTag } from '@/interfaces/bot';

export const getSlug = (item: GuildWebPage | GuildWebCategory | GuildWebTag) => (item.slug ?? item.id).toLowerCase();
