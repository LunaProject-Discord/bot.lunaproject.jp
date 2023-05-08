'use client';

import { OAuthUser } from '@lunaproject-discord/web-discord/dist/interfaces/discord';
import React, { Fragment, ReactNode, useState } from 'react';
import { LocalizationProps } from '../../interfaces/localization';
import { UserPopover } from '../_popovers/user';
import { DesktopNavigation } from './desktop';
import { MobileNavigation } from './mobile';

export type PopoverType = 'services' | 'notifications' | 'user' | undefined;

export interface NavigationProps extends LocalizationProps {
    user: OAuthUser | undefined;
}

export interface NavigationRootProps extends NavigationProps {
    openPopover: (elem: HTMLButtonElement, type: PopoverType) => void;
    closePopover: () => void;
}

export interface NavigationItemProps {
    href: string;
    icon?: ReactNode;
}

export const Navigation = ({ user, localization }: NavigationProps) => {
    const [popoverState, setPopoverState] = useState<PopoverType>(undefined);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = popoverState !== undefined && Boolean(anchorEl);

    const openPopover = (elem: HTMLButtonElement, type: PopoverType) => {
        setPopoverState('user');
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
                localization={localization}
            />
            <MobileNavigation
                openPopover={openPopover}
                closePopover={closePopover}
                user={user}
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
