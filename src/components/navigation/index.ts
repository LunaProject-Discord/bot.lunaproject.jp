import { ReactNode } from 'react';

export type NavigationItemPredicate = (pathname: string, href: string) => boolean;

export const defaultPredicate: NavigationItemPredicate = (pathname, href) => href === '/' ? pathname === href : pathname.startsWith(href);

export interface NavigationItemProps {
    href: string;
    predicate?: NavigationItemPredicate;
    icon?: ReactNode;
}

export * from './appbar';
export * from './drawer';
