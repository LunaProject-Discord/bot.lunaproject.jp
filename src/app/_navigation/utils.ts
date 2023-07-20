import { NavigationItemPredicate } from '@app/_navigation/index';

export const defaultPredicate: NavigationItemPredicate = (pathname, href) => href === '/' ? pathname === href : pathname.startsWith(href);
