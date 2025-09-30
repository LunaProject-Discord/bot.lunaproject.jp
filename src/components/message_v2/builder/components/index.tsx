import { MessageBuilderMobileMenu } from '@/components/message_v2';
import { LocalizationProps } from '@/interfaces/localization';
import { useMediaQuery } from '@mui/material';
import { MouseEvent } from 'react';
import { MessageBuilderDesktopMenu } from './desktop_menu';

export interface MessageBuilderMenuProps extends LocalizationProps {
    openBottomSheet: boolean;
    onSaveButtonClick: (e: MouseEvent<HTMLButtonElement>) => void;
    onCancelButtonClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const MessageBuilderMenu = (props: MessageBuilderMenuProps) => {
    const isSmall = useMediaQuery((theme) => theme.breakpoints.up('sm'));
    if (isSmall) {
        return (<MessageBuilderDesktopMenu {...props} />);
    } else {
        return (<MessageBuilderMobileMenu {...props} />);
    }
};

export * from './desktop_menu';
export * from './mobile_menu';
