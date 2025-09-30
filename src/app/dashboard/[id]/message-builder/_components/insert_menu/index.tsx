'use client';

import { PopoverListItemButton, PopoverListItemIcon } from '@/app/_popovers';
import {
    AddIcon,
    ChatIcon,
    DescriptionIcon,
    DockToRightFillIcon,
    PageFooterIcon,
    PersonIcon,
    SegmentIcon,
    TitleIcon
} from '@/components/icons';
import { LocalizationProps } from '@/interfaces/localization';
import { PickerBaseProps } from '@lunaproject/web-core/dist/components/Picker';
import { borderAndBoxShadow } from '@lunaproject/web-core/dist/utils';
import { Divider, Fab, List, ListItemText, ListSubheader, Popover, useMediaQuery } from '@mui/material';
import { Editor, useCurrentEditor } from '@tiptap/react';
import React, { Fragment, useState } from 'react';

export interface MessageEditorFabInsertMenuProps extends PickerBaseProps, LocalizationProps {
    editor: Editor;
}

export const MessageEditorFabInsertMenuRoot = (
    {
        anchorEl,
        setAnchorEl,
        editor,
        localization
    }: MessageEditorFabInsertMenuProps
) => {
    const { translations } = localization;

    const isSmall = useMediaQuery((theme) => theme.breakpoints.up('sm'));

    return (
        <Popover
            open={anchorEl !== undefined}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(undefined)}
            anchorOrigin={{
                vertical: -16,
                horizontal: 'right'
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
            slotProps={{
                paper: {
                    sx: (theme) => ({
                        width: 300,
                        ...borderAndBoxShadow(theme)
                    })
                }
            }}
            className="dark"
        >
            <List>
                <PopoverListItemButton dense>
                    <PopoverListItemIcon>
                        <ChatIcon />
                    </PopoverListItemIcon>
                    <ListItemText primary="本文" />
                </PopoverListItemButton>
                <PopoverListItemButton
                    onClick={() => {
                        editor.chain().focus().addMessageEmbed().run();
                        setAnchorEl(undefined);
                    }}
                    dense
                >
                    <PopoverListItemIcon>
                        <DockToRightFillIcon />
                    </PopoverListItemIcon>
                    <ListItemText primary="Embed" />
                </PopoverListItemButton>
            </List>
            <Divider />
            {editor.isActive('messageEmbed') && <List
                subheader={
                    <ListSubheader
                        component="div"
                        sx={(theme) => ({
                            pt: 1,
                            pb: .5,
                            px: 1.5,
                            lineHeight: 'unset',
                            backgroundImage: 'none',
                            ...theme.applyStyles('dark', {
                                backgroundImage: theme.vars.overlays[8]
                            })
                        })}
                    >
                        Embed
                    </ListSubheader>
                }
            >
                <PopoverListItemButton
                    onClick={() => {
                        editor.chain().focus().setMessageEmbedTitle().run();
                        setAnchorEl(undefined);
                    }}
                    disabled={!editor.can().setMessageEmbedTitle()}
                    dense
                >
                    <PopoverListItemIcon>
                        <TitleIcon />
                    </PopoverListItemIcon>
                    <ListItemText primary="タイトル" />
                </PopoverListItemButton>
                <PopoverListItemButton
                    onClick={() => {
                        editor.chain().focus().setMessageEmbedDescription().run();
                        setAnchorEl(undefined);
                    }}
                    disabled={!editor.can().setMessageEmbedDescription()}
                    dense
                >
                    <PopoverListItemIcon>
                        <DescriptionIcon />
                    </PopoverListItemIcon>
                    <ListItemText primary="説明" />
                </PopoverListItemButton>
                <PopoverListItemButton
                    onClick={() => {
                        editor.chain().focus().setMessageEmbedAuthor().run();
                        setAnchorEl(undefined);
                    }}
                    disabled={!editor.can().setMessageEmbedAuthor()}
                    dense
                >
                    <PopoverListItemIcon>
                        <PersonIcon />
                    </PopoverListItemIcon>
                    <ListItemText primary="著者" />
                </PopoverListItemButton>
                <PopoverListItemButton
                    onClick={() => {
                        editor.chain().focus().setMessageEmbedFooter().run();
                        setAnchorEl(undefined);
                    }}
                    disabled={!editor.can().setMessageEmbedFooter()}
                    dense
                >
                    <PopoverListItemIcon>
                        <PageFooterIcon />
                    </PopoverListItemIcon>
                    <ListItemText primary="フッター" />
                </PopoverListItemButton>
                <PopoverListItemButton
                    onClick={() => {
                        editor.chain().focus().addMessageEmbedField().run();
                        setAnchorEl(undefined);
                    }}
                    disabled={!editor.can().addMessageEmbedField()}
                    dense
                >
                    <PopoverListItemIcon>
                        <SegmentIcon />
                    </PopoverListItemIcon>
                    <ListItemText primary="フィールド" />
                </PopoverListItemButton>
            </List>}
        </Popover>
    );
};

export const MessageEditorFabInsertMenu = ({ localization }: LocalizationProps) => {
    const { translations } = localization;

    const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined);

    const { editor } = useCurrentEditor();
    if (!editor)
        return null;

    return (
        <Fragment>
            <Fab
                onClick={(e) => setAnchorEl(e.currentTarget)}
                variant="extended"
                sx={{
                    textBoxTrim: 'trim-both',
                    textBoxEdge: 'cap alphabetic'
                }}
            >
                <AddIcon sx={{ mr: 1 }} />
                要素を追加
            </Fab>
            <MessageEditorFabInsertMenuRoot
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                editor={editor}
                localization={localization}
            />
        </Fragment>
    );
};
