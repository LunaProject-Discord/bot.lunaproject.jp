import { GuildLevel } from '@interfaces/bot';
import { filterPredicateMember, filterPredicateUser } from '@utils/discord';

export const getMaxExperience = (level: number): number => 20 * Math.max(level, 1);

export const filterPredicateLevel = (level: GuildLevel, keyword: string) => keyword.length < 1
    || level.user.id.includes(keyword)
    || 'name' in level.user && filterPredicateUser(level.user, keyword)
    || level.member && filterPredicateMember(level.member, keyword);

export const getLevelPages = (levels: GuildLevel[], perPageLimit: number): GuildLevel[][] => new Array(Math.ceil(levels.length / perPageLimit)).fill(undefined).map((_, i) => levels.slice(i * perPageLimit, (i + 1) * perPageLimit));

export const getLevels = (levels: GuildLevel[], keyword: string, pageIndex: number, perPageLimit: number): GuildLevel[] => {
    const filteredLevels = levels.filter((level) => filterPredicateLevel(level, keyword));
    const levelPages = getLevelPages(filteredLevels, perPageLimit);
    return (keyword.length < 1 ? levelPages[pageIndex] : filteredLevels) ?? [];
};
