import { DesktopServicesPopover, MobileServicesPopover } from '@/app/_popovers';
import { LocalizationProps } from '@/interfaces/localization';
import { popoverAtom, ServicesPopoverState } from '@/states/popover';
import { useMediaQuery } from '@mui/material';
import { atom } from 'jotai';

export const servicesPopoverStateAtom = atom(
    (get) => {
        const popoverState = get(popoverAtom);
        return popoverState?.type === 'services' ? popoverState : undefined;
    },
    (get, set, state: Partial<Omit<ServicesPopoverState, 'type'>> | undefined) => {
        if (!state) {
            set(popoverAtom, undefined);
            return;
        }

        const popoverState = get(popoverAtom);
        if (popoverState?.type !== 'services') return;

        set(popoverAtom, { ...popoverState, ...state });
    }
);

export const ServicesPopover = ({ localization }: LocalizationProps) => {
    const isSmall = useMediaQuery((theme) => theme.breakpoints.up('sm'));
    const Popover = isSmall ? DesktopServicesPopover : MobileServicesPopover;
    return (<Popover localization={localization} />);
};

export * from './desktop';
export * from './mobile';
