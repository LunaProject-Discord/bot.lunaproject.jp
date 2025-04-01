'use client';

import { AddIcon, CloseIcon, ContentCopyIcon, KeyboardArrowDownIcon, KeyboardArrowUpIcon } from '@/components/icons';
import { MessageBuilderAction, MessageBuilderActionType } from '@/components/message';
import { LocalizationProps } from '@/interfaces/localization';
import { MessageEmbedData } from '@/interfaces/message';
import { useTheme } from '@emotion/react';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import { SectionCardDisabledProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { decimalToHex } from '@lunaproject/web-discord-components';
import {
    Accordion as MuiAccordion,
    AccordionDetails as MuiAccordionDetails,
    AccordionProps,
    Box,
    IconButton,
    styled,
    Tooltip
} from '@mui/material';
import React, { MouseEvent } from 'react';
import { EmbedAccordionSummary } from './accordion';
import { EmbedAuthorEditor } from './author';
import { EmbedBodyEditor } from './body';
import { EmbedFooterEditor } from './footer';
import { EmbedImageEditor } from './image';

interface ContainerAccordionProps {
    borderColor: string;
}

const ContainerAccordion = styled(
    (props: AccordionProps) => (<MuiAccordion disableGutters elevation={0} {...props} />),
    { shouldForwardProp: (prop) => prop !== 'borderColor' }
)<ContainerAccordionProps>(({ theme, borderColor }) => ({
    // border: 'solid 1px rgb(235 237 239)',
    border: `solid 1px ${theme.vars.palette.divider}`,
    borderLeft: `solid 4px ${borderColor}`,
    borderRadius: 4,
    boxShadow: 'rgb(0 0 0 / .08) 0px 4px 4px',
    '&::before': {
        content: 'none'
    }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(0)
}));

export interface EmbedEditorProps extends SectionCardDisabledProps, LocalizationProps {
    index: number;
    embed: MessageEmbedData;
    dispatch: (action: MessageBuilderAction) => void;
    remove: (e: MouseEvent<HTMLButtonElement>) => void;
    visibleMoveUpButton: boolean;
    visibleMoveDownButton: boolean;
    moveUp: (e: MouseEvent<HTMLButtonElement>) => void;
    moveDown: (e: MouseEvent<HTMLButtonElement>) => void;
    duplicate: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const EmbedEditor = (
    {
        index,
        embed,
        dispatch,
        disabled,
        remove,
        visibleMoveUpButton,
        visibleMoveDownButton,
        moveUp,
        moveDown,
        duplicate,
        localization
    }: EmbedEditorProps
) => {
    const { translations } = localization;

    const theme = useTheme();

    return (
        <ContainerAccordion borderColor={embed.color ? decimalToHex(embed.color) : theme.palette.background.tertiary}>
            <EmbedAccordionSummary
                sx={{
                    height: 40,
                    minHeight: '40px !important',
                    px: 1,
                    '&:hover': {
                        background: (theme) => theme.vars.palette.action.hover
                    }
                }}
            >
                {translations.embed} #{index + 1}{embed.title && ` — ${embed.title}`}
                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: .5 }}>
                    {visibleMoveUpButton && <Tooltip title={translations.move_up}>
                        <IconButton onClick={moveUp} size="small" sx={{ width: 36, height: 36 }}>
                            <KeyboardArrowUpIcon />
                        </IconButton>
                    </Tooltip>}
                    {visibleMoveDownButton && <Tooltip title={translations.move_down}>
                        <IconButton onClick={moveDown} size="small" sx={{ width: 36, height: 36 }}>
                            <KeyboardArrowDownIcon />
                        </IconButton>
                    </Tooltip>}
                    <Tooltip title={translations.duplicate}>
                        <IconButton onClick={duplicate} size="small" sx={{ width: 36, height: 36 }}>
                            <ContentCopyIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={translations.remove}>
                        <IconButton onClick={remove} color="error" size="small" sx={{ width: 36, height: 36 }}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </EmbedAccordionSummary>
            <AccordionDetails>
                <EmbedAuthorEditor
                    embedIndex={index}
                    author={embed.author}
                    dispatch={dispatch}
                    disabled={disabled}
                    localization={localization}
                />
                <EmbedBodyEditor
                    embedIndex={index}
                    body={{
                        title: embed.title,
                        description: embed.description,
                        url: embed.url,
                        color: embed.color
                    }}
                    dispatch={dispatch}
                    disabled={disabled}
                    localization={localization}
                />
                <EmbedImageEditor
                    embedIndex={index}
                    image={{
                        image: embed.image,
                        thumbnail: embed.thumbnail
                    }}
                    dispatch={dispatch}
                    disabled={disabled}
                    localization={localization}
                />
                <EmbedFooterEditor
                    embedIndex={index}
                    footer={{
                        ...embed.footer,
                        timestamp: embed.timestamp
                    }}
                    dispatch={dispatch}
                    disabled={disabled}
                    localization={localization}
                />
            </AccordionDetails>
        </ContainerAccordion>
    );
};

export interface EmbedsEditorProps extends SectionCardDisabledProps, LocalizationProps {
    embeds: MessageEmbedData[];
    dispatch: (action: MessageBuilderAction) => void;
}

export const EmbedsEditor = ({ embeds, dispatch, disabled, localization }: EmbedsEditorProps) => {
    const { translations } = localization;

    const add = () => dispatch({ type: MessageBuilderActionType.AddEmbed });

    const remove = (i: number) => dispatch({ type: MessageBuilderActionType.RemoveEmbed, index: i });

    const moveUp = (i: number) => {
    };

    const moveDown = (i: number) => {

    };

    const duplicate = (i: number, mode: 'next' | 'last') => {
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                    onClick={add}
                    disabled={disabled || embeds.length > 9}
                    disableElevation
                    variant="outlined"
                    corners="extended"
                    startIcon={<AddIcon />}
                >
                    {translations.embed_add}
                </Button>
            </Box>
            {embeds.map((embed, i) => (
                <EmbedEditor
                    key={i}
                    index={i}
                    embed={embed}
                    dispatch={dispatch}
                    disabled={disabled}
                    remove={(e) => {
                        e.stopPropagation();
                        remove(i);
                    }}
                    visibleMoveUpButton={i !== 0}
                    visibleMoveDownButton={i !== embeds.length - 1}
                    moveUp={(e) => {
                        e.stopPropagation();
                        moveUp(i);
                    }}
                    moveDown={(e) => {
                        e.stopPropagation();
                        moveDown(i);
                    }}
                    duplicate={(e) => {
                        e.stopPropagation();
                        duplicate(i, e.shiftKey ? 'last' : 'next');
                    }}
                    localization={localization}
                />
            ))}
        </Box>
    );
};
