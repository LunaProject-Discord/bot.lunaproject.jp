'use client';

import { UserFlags } from '@interfaces/bot';
import { LocalizationProps } from '@interfaces/localization';
import { OAuthUser } from '@lunaproject-discord/web-discord/dist/interfaces/discord';
import React, { Fragment, ReactNode, useState } from 'react';
import { UserPopover } from '../_popovers/user';
import { DesktopNavigation } from './desktop';
import { MobileNavigation } from './mobile';

export type PopoverType = 'services' | 'notifications' | 'user' | undefined;

export interface NavigationProps extends LocalizationProps {
    user: OAuthUser | undefined;
    flags: UserFlags | undefined;
}

export interface NavigationRootProps extends NavigationProps {
    openPopover: (elem: HTMLButtonElement, type: PopoverType) => void;
    closePopover: () => void;
}

export type NavigationItemPredicate = (pathname: string, href: string) => boolean;

export interface NavigationItemProps {
    href: string;
    predicate?: NavigationItemPredicate;
    icon?: ReactNode;
}

export const Navigation = ({ user, flags, localization }: NavigationProps) => {
    const [popoverState, setPopoverState] = useState<PopoverType>(undefined);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = popoverState !== undefined && Boolean(anchorEl);

    const openPopover = (elem: HTMLButtonElement, type: PopoverType) => {
        setPopoverState(type);
        setAnchorEl(elem);
    };

    const closePopover = () => {
        setPopoverState(undefined);
        setAnchorEl(null);
    };

    return (
        <Fragment>
            <DesktopNavigation
                openPopover={openPopover}
                closePopover={closePopover}
                user={user}
                flags={flags}
                localization={localization}
            />
            <MobileNavigation
                openPopover={openPopover}
                closePopover={closePopover}
                user={user}
                flags={flags}
                localization={localization}
            />

            <UserPopover
                open={popoverState === 'user' && open}
                anchorEl={anchorEl}
                onClose={closePopover}
                user={user}
                localization={localization}
            />
        </Fragment>
    );
};
