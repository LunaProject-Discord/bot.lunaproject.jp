'use client';

import { servicesPopoverStateAtom } from '@app/_popovers/services';
import { DescriptionIcon, ManageAccountsIcon, OpenInNewIcon } from '@components/icons';
import { LocalizationProps } from '@interfaces/localization';
import { NightlightRound } from '@mui/icons-material';
import { Divider, List, ListItemText, Popover } from '@mui/material';
import { useAtom } from 'jotai/index';
import React from 'react';
import { PopoverListItemIcon, PopoverListItemLinkButton } from '../index';

export const DesktopServicesPopover = ({ localization }: LocalizationProps) => {
    const { translations } = localization;

    const [popoverState, setPopoverState] = useAtom(servicesPopoverStateAtom);

    const handleClose = () => setPopoverState(undefined);

    return (
        <Popover
            open={popoverState !== undefined}
            anchorEl={popoverState?.anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
            slotProps={{
                paper: {
                    sx: {
                        width: 300,
                        border: (theme) => `solid 1px ${theme.palette.divider}`,
                        boxShadow: (theme) => `0 ${theme.spacing(.5)} ${theme.spacing(1)} rgba(0, 0, 0, .15)`
                    }
                }
            }}
        >
            <List>
                <PopoverListItemLinkButton href="https://lunaproject.jp/" target="_blank" dense>
                    <PopoverListItemIcon>
                        <NightlightRound sx={{ color: '#ffc636', transform: 'rotate(-20deg)' }} />
                    </PopoverListItemIcon>
                    <ListItemText primary="Luna Project" />
                    <OpenInNewIcon color="action" />
                </PopoverListItemLinkButton>
                <PopoverListItemLinkButton href="https://docs.lunaproject.jp/" target="_blank" dense>
                    <PopoverListItemIcon>
                        <DescriptionIcon />
                    </PopoverListItemIcon>
                    <ListItemText primary={translations.lunaproject_document} />
                    <OpenInNewIcon color="action" />
                </PopoverListItemLinkButton>
            </List>
            <Divider />
            <List>
                <PopoverListItemLinkButton href="https://account.lunaproject.jp/" dense>
                    <PopoverListItemIcon>
                        <ManageAccountsIcon />
                    </PopoverListItemIcon>
                    <ListItemText primary={translations.lunaproject_account} />
                </PopoverListItemLinkButton>
                <PopoverListItemLinkButton href="https://yudzuki.lunaproject.jp/" dense>
                    <PopoverListItemIcon>
                        <NightlightRound sx={{ color: '#959ac0', transform: 'rotate(-20deg)' }} />
                    </PopoverListItemIcon>
                    <ListItemText primary="結月 -ゆづき-" />
                </PopoverListItemLinkButton>
                <PopoverListItemLinkButton href="https://satsuki.lunaproject.jp/" dense>
                    <PopoverListItemIcon>
                        <NightlightRound sx={{ color: '#f792d5', transform: 'rotate(-20deg)' }} />
                    </PopoverListItemIcon>
                    <ListItemText primary="彩月 -さつき-" />
                </PopoverListItemLinkButton>
                <PopoverListItemLinkButton href="https://natsuki.lunaproject.jp/" dense>
                    <PopoverListItemIcon>
                        <NightlightRound sx={{ color: '#b0ff7c', transform: 'rotate(-20deg)' }} />
                    </PopoverListItemIcon>
                    <ListItemText primary="菜月 -なつき-" />
                </PopoverListItemLinkButton>
            </List>
        </Popover>
    );
};
