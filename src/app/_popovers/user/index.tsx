import { DesktopUserPopover, MobileUserPopover } from '@app/_popovers';
import { LocalizationProps } from '@interfaces/localization';
import { OAuthUser } from '@lunaproject/web-discord/dist/interfaces';
import { Theme, useMediaQuery } from '@mui/material';
import { popoverAtom, UserPopoverState } from '@states/popover';
import { atom } from 'jotai';

export interface UserPopoverProps extends LocalizationProps {
    user: OAuthUser | undefined;
}

export const userPopoverStateAtom = atom(
    (get) => {
        const popoverState = get(popoverAtom);
        return popoverState?.type === 'user' ? popoverState : undefined;
    },
    (get, set, state: Partial<Omit<UserPopoverState, 'type'>> | undefined) => {
        if (!state) {
            set(popoverAtom, undefined);
            return;
        }

        const popoverState = get(popoverAtom);
        if (popoverState?.type !== 'user') return;

        set(popoverAtom, { ...popoverState, ...state });
    }
);

export const UserPopover = ({ user, localization }: UserPopoverProps) => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.up('sm'));
    const Popover = isSmall ? DesktopUserPopover : MobileUserPopover;
    return (<Popover user={user} localization={localization} />);
};

export * from './desktop';
export * from './mobile';
