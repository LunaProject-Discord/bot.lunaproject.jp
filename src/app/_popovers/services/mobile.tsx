import { PopoverListItemIcon, PopoverListItemLinkButton } from '@/app/_popovers';
import { servicesPopoverStateAtom } from '@/app/_popovers/services';
import { BottomSheet, BottomSheetContent } from '@/components/bottom_sheet';
import { DescriptionIcon, ManageAccountsIcon, OpenInNewIcon } from '@/components/icons';
import { LocalizationProps } from '@/interfaces/localization';
import { Divider, List, listItemButtonClasses, ListItemText } from '@mui/material';
import { useAtom } from 'jotai';
import Image from 'next/image';
import React, { useRef } from 'react';
import { BottomSheetRef } from 'react-spring-bottom-sheet';

export const MobileServicesPopover = ({ localization }: LocalizationProps) => {
    const { translations } = localization;

    const sheetRef = useRef<BottomSheetRef | null>(null);

    const [popoverState, setPopoverState] = useAtom(servicesPopoverStateAtom);

    return (
        <BottomSheet
            ref={sheetRef}
            open={popoverState !== undefined}
            onDismiss={() => setPopoverState(undefined)}
            expandOnContentDrag
        >
            <BottomSheetContent
                sx={{
                    p: 0,
                    gap: 0,
                    [`& .${listItemButtonClasses.root}`]: {
                        px: 2,
                        py: 1,
                        gap: 2
                    }
                }}
            >
                <List>
                    <PopoverListItemLinkButton href="https://lunaproject.jp/" target="_blank">
                        <PopoverListItemIcon>
                            <Image src="/lunaproject/icon.svg" alt="" width={24} height={24} />
                        </PopoverListItemIcon>
                        <ListItemText primary="Luna Project" />
                        <OpenInNewIcon color="action" />
                    </PopoverListItemLinkButton>
                    <PopoverListItemLinkButton href="https://docs.lunaproject.jp/" target="_blank">
                        <PopoverListItemIcon>
                            <DescriptionIcon />
                        </PopoverListItemIcon>
                        <ListItemText primary={translations.lunaproject_document} />
                        <OpenInNewIcon color="action" />
                    </PopoverListItemLinkButton>
                </List>
                <Divider />
                <List>
                    <PopoverListItemLinkButton href="https://account.lunaproject.jp/">
                        <PopoverListItemIcon>
                            <ManageAccountsIcon />
                        </PopoverListItemIcon>
                        <ListItemText primary={translations.lunaproject_account} />
                    </PopoverListItemLinkButton>
                    <PopoverListItemLinkButton href="https://yudzuki.lunaproject.jp/">
                        <PopoverListItemIcon>
                            <Image src="/yudzuki/icon.svg" alt="" width={24} height={24} />
                        </PopoverListItemIcon>
                        <ListItemText primary="結月 -ゆづき-" />
                    </PopoverListItemLinkButton>
                    <PopoverListItemLinkButton href="https://satsuki.lunaproject.jp/">
                        <PopoverListItemIcon>
                            <Image src="/satsuki/icon.svg" alt="" width={24} height={24} />
                        </PopoverListItemIcon>
                        <ListItemText primary="彩月 -さつき-" />
                    </PopoverListItemLinkButton>
                    <PopoverListItemLinkButton href="https://natsuki.lunaproject.jp/">
                        <PopoverListItemIcon>
                            <Image src="/natsuki/icon.svg" alt="" width={24} height={24} />
                        </PopoverListItemIcon>
                        <ListItemText primary="菜月 -なつき-" />
                    </PopoverListItemLinkButton>
                </List>
            </BottomSheetContent>
        </BottomSheet>
    );
};
