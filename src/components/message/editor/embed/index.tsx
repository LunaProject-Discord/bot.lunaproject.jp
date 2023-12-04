'use client';

import { ItemDisabledProps, ItemVariableProps } from '@components/items';
import { useTheme } from '@emotion/react';
import { LocalizationProps } from '@interfaces/localization';
import { getNewEmbed } from '@libs/message';
import { Embed } from '@lunaproject/web-discord/dist/interfaces';
import {
    AddOutlined,
    ClearOutlined,
    ContentCopyOutlined,
    ExpandMoreOutlined,
    KeyboardArrowDownOutlined,
    KeyboardArrowUpOutlined
} from '@mui/icons-material';
import {
    Accordion as MuiAccordion,
    AccordionDetails as MuiAccordionDetails,
    AccordionProps,
    AccordionSummary as MuiAccordionSummary,
    AccordionSummaryProps,
    Box,
    Button,
    IconButton,
    styled,
    Tooltip
} from '@mui/material';
import {
    moveDown as moveDownArray,
    moveUp as moveUpArray,
    remove as removeArray,
    replace as replaceArray
} from '@utils/array';
import { getStateActionValue } from '@utils/state';
import { nanoid } from 'nanoid';
import React, { MouseEvent } from 'react';
import { EmbedAccordionSummary } from './accordion';
import { EmbedAuthorEditor } from './author';
import { EmbedBody, EmbedBodyEditor } from './body';
import { EmbedFieldsEditor } from './fields';
import { EmbedFooter, EmbedFooterEditor } from './footer';
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

interface EmbedEditorProps extends ItemDisabledProps, ItemVariableProps<Embed>, LocalizationProps {
    index: number;
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
        value,
        setValue,
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

    const embedColor = value.color.rgbNumber() === 0xffffff ? undefined : value.color.hex();
    const body: EmbedBody = { color: value.color, title: value.title, description: value.description, url: value.url };
    const footer: EmbedFooter = { timestamp: value.timestamp, ...value.footer };

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
                {translations.embed} #{index + 1}{value.title && ` — ${value.title}`}
                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: .5 }}>
                    {visibleMoveUpButton && <Tooltip title={translations.move_up} placement="top">
                        <IconButton onClick={moveUp} size="small" sx={{ width: 36, height: 36 }}>
                            <KeyboardArrowUpOutlined />
                        </IconButton>
                    </Tooltip>}
                    {visibleMoveDownButton && <Tooltip title={translations.move_down} placement="top">
                        <IconButton onClick={moveDown} size="small" sx={{ width: 36, height: 36 }}>
                            <KeyboardArrowDownOutlined />
                        </IconButton>
                    </Tooltip>}
                    <Tooltip title={translations.duplicate} placement="top">
                        <IconButton onClick={duplicate} size="small" sx={{ width: 36, height: 36 }}>
                            <ContentCopyOutlined fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={translations.remove} placement="top">
                        <IconButton onClick={remove} color="error" size="small" sx={{ width: 36, height: 36 }}>
                            <ClearOutlined fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </EmbedAccordionSummary>
            <AccordionDetails>
                <EmbedAuthorEditor
                    value={value.author}
                    setValue={(action) => setValue((prevValue) => ({
                        ...prevValue,
                        author: getStateActionValue(action, prevValue.author)
                    }))}
                    disabled={disabled}
                    localization={localization}
                />
                <EmbedBodyEditor
                    value={body}
                    setValue={(action) => setValue((prevValue) => ({
                        ...prevValue,
                        ...getStateActionValue(action, body)
                    }))}
                    disabled={disabled}
                    localization={localization}
                />
                <EmbedFieldsEditor
                    value={value.fields}
                    setValue={(action) => setValue((prevValue) => ({
                        ...prevValue,
                        fields: getStateActionValue(action, prevValue.fields)
                    }))}
                    disabled={disabled}
                    localization={localization}
                />
                <EmbedImageEditor
                    value={value.image}
                    setValue={(action) => setValue((prevValue) => ({
                        ...prevValue,
                        image: getStateActionValue(action, prevValue.image)
                    }))}
                    disabled={disabled}
                    localization={localization}
                />
                <EmbedFooterEditor
                    value={footer}
                    setValue={(action) => {
                        const { timestamp, ...value } = getStateActionValue(action, footer);
                        setValue((prevValue) => ({ ...prevValue, timestamp, footer: value }));
                    }}
                    disabled={disabled}
                    localization={localization}
                />
            </AccordionDetails>
        </ContainerAccordion>
    );
};

type EmbedsEditorProps = ItemDisabledProps & ItemVariableProps<Embed[]> & LocalizationProps;

export const EmbedsEditor = ({ value, setValue, disabled, localization }: EmbedsEditorProps) => {
    const { translations } = localization;

    const add = () => setValue((prevValue) => [...prevValue, getNewEmbed()]);

    const remove = (i: number) => setValue((prevValue) => removeArray(prevValue, i));

    const update = (i: number, embed: Embed) => setValue((prevValue) => replaceArray(prevValue, i, embed));

    const moveUp = (i: number) => setValue((prevValue) => moveUpArray(prevValue, i));

    const moveDown = (i: number) => setValue((prevValue) => moveDownArray(prevValue, i));

    const duplicate = (i: number, mode: 'next' | 'last') => setValue((prevValue) => {
        const embed = prevValue[i];
        return replaceArray(prevValue, mode === 'next' ? i + 1 : prevValue.length, { ...embed, _id: nanoid() }, 0);
    });

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                    onClick={add}
                    disabled={disabled || value.length > 9}
                    disableElevation
                    variant="contained"
                    startIcon={<AddOutlined />}
                >
                    {translations.embed_add}
                </Button>
            </Box>
            {value.map((embed, i) => (
                <EmbedEditor
                    key={embed._id ?? i}
                    index={i}
                    value={embed}
                    setValue={(action) => update(i, getStateActionValue(action, embed))}
                    disabled={disabled}
                    remove={(e) => {
                        e.stopPropagation();
                        remove(i);
                    }}
                    visibleMoveUpButton={i !== 0}
                    visibleMoveDownButton={i !== value.length - 1}
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
