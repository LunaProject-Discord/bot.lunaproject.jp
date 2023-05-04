'use client';

import { useTheme } from '@emotion/react';
import { Embed as EmbedData } from '@lunaproject-discord/web-discord/dist/interfaces/message';
import { ClearOutlined, ExpandMoreOutlined } from '@mui/icons-material';
import {
    Accordion as MuiAccordion,
    AccordionDetails as MuiAccordionDetails,
    AccordionProps,
    AccordionSummary as MuiAccordionSummary,
    AccordionSummaryProps,
    Box,
    IconButton,
    styled,
    Tooltip
} from '@mui/material';
import React from 'react';
import { LocalizationProps } from '../../../../interfaces/localization';
import { EmbedAccordionSummary } from './accordion';
import { EmbedAuthorEditor } from './author';
import { EmbedBodyEditor } from './body';
import { EmbedFieldsEditor } from './fields';
import { EmbedFooterEditor } from './footer';
import { EmbedImageEditor } from './image';

interface ContainerAccordionProps {
    borderColor: string;
}

const ContainerAccordion = styled(
    (props: AccordionProps) => (<MuiAccordion disableGutters elevation={0} {...props} />),
    { shouldForwardProp: (prop) => prop !== 'borderColor' }
)<ContainerAccordionProps>(({ theme, borderColor }) => ({
    // border: 'solid 1px rgb(235, 237, 239)',
    border: `solid 1px ${theme.palette.divider}`,
    borderLeft: `solid 4px ${borderColor}`,
    borderRadius: 4,
    boxShadow: 'rgb(0 0 0 / 8%) 0px 4px 4px',
    '&::before': {
        content: 'none'
    }
}));

const Accordion = styled(
    (props: AccordionProps) => (<MuiAccordion disableGutters elevation={0} {...props} />)
)(({ theme }) => ({
    border: 'none',
    borderBottom: `solid 1px ${theme.palette.divider}`,
    borderRadius: '0 !important',
    boxShadow: 'none',
    '&::before': {
        content: 'none'
    },
    '&:last-of-type': {
        border: 'none',
        borderBottomRightRadius: `4px !important`
    }
}));

const AccordionSummary = styled(
    (props: AccordionSummaryProps) => (<MuiAccordionSummary expandIcon={<ExpandMoreOutlined />} {...props} />)
)(({ theme }) => ({
    height: 40,
    minHeight: '40px !important',
    '&:hover': {
        background: theme.palette.action.hover
    }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(0)
}));

interface Props extends LocalizationProps {
    id: number;
    embed: EmbedData;
    onChange: (embed: EmbedData) => void;
    removeEmbed: () => void;
}

export const EmbedEditor = ({ id, embed, onChange, removeEmbed, localization }: Props) => {
    const { translations } = localization;

    const theme = useTheme();

    const embedColor = embed.color.rgbNumber() === 0xffffff ? undefined : embed.color.hex();

    return (
        <ContainerAccordion borderColor={embedColor || theme.background.tertiary}>
            <EmbedAccordionSummary
                sx={{
                    height: 40,
                    minHeight: '40px !important',
                    px: 1,
                    '&:hover': {
                        background: (theme) => theme.palette.action.hover
                    }
                }}
            >
                {translations.embeds} #{id + 1}{embed.title && ` — ${embed.title}`}
                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: .5 }}>
                    <Tooltip title={translations.remove} placement="top">
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                removeEmbed();
                            }}
                            size="small"
                            color="error"
                        >
                            <ClearOutlined />
                        </IconButton>
                    </Tooltip>
                </Box>
            </EmbedAccordionSummary>
            <AccordionDetails>
                <EmbedAuthorEditor
                    value={embed.author}
                    setValue={(author) => onChange({ ...embed, author })}
                    localization={localization}
                />
                <EmbedBodyEditor
                    value={{ color: embed.color, title: embed.title, description: embed.description, url: embed.url }}
                    setValue={(body) => onChange({ ...embed, ...body })}
                    localization={localization}
                />
                <EmbedFieldsEditor
                    value={embed.fields}
                    setValue={(fields) => onChange({ ...embed, fields })}
                    localization={localization}
                />
                <EmbedImageEditor
                    value={embed.image}
                    setValue={(image) => onChange({ ...embed, image })}
                    localization={localization}
                />
                <EmbedFooterEditor
                    value={{ timestamp: embed.timestamp, ...embed.footer }}
                    setValue={({ timestamp, ...footer }) => onChange({ ...embed, timestamp, footer })}
                    localization={localization}
                />
            </AccordionDetails>
        </ContainerAccordion>
    );
};
