'use client';

import { CloseIcon, DeleteIcon, UndoIcon } from '@/components/icons';
import { ColorPickerPreview } from '@/components/picker';
import { SectionColorFieldCard } from '@/components/section_card';
import { CodeStyleContainer } from '@/components/text';
import { GuildWebTag } from '@/interfaces/bot';
import { LocalizationProps } from '@/interfaces/localization';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import {
    SectionAccordionCard,
    sectionAccordionCardClasses,
    SectionAccordionCardRootProps,
    sectionButtonCardClasses,
    SectionCard,
    sectionCardClasses,
    sectionCardDisplayClasses,
    SectionCardProps,
    SectionCardVariableProps,
    SectionTextFieldCard
} from '@lunaproject/web-core/dist/components/SectionCard';
import { generateComponentClasses, getStateActionValue } from '@lunaproject/web-core/dist/utils';
import { avatarClasses, buttonClasses, useTheme } from '@mui/material';
import { HsvaColor } from '@uiw/react-color';
import clsx from 'clsx';
import React, { MouseEvent, SetStateAction, useCallback } from 'react';

export interface Tag {
    id: string;
    slug: string;
    color: HsvaColor;
    name: string;
    description: string;
    deleted: boolean;
    _defaultExpanded?: boolean;
}

export const sectionTagCardClasses = generateComponentClasses(
    'SectionTagCard',
    [
        'root',

        'deleted'
    ]
);

export interface SectionTagCardRootProps extends SectionCardVariableProps<{
    value: Tag;
}>, LocalizationProps {
    tag?: GuildWebTag;
}

export type SectionTagCardProps =
    & Pick<SectionCardProps, 'disabled' | 'variant' | 'className' | 'sx'>
    & Omit<SectionAccordionCardRootProps, 'header' | 'headerChildren'>
    & SectionTagCardRootProps;

export const SectionTagCard = (
    {
        value: {
            id,
            slug,
            color,
            name,
            description,
            deleted,
            _defaultExpanded
        },
        setValue,
        tag,
        expanded,
        setExpanded,
        defaultExpanded,
        disabled,
        readOnly,
        variant,
        className,
        sx,
        localization,
        ...props
    }: SectionTagCardProps
) => {
    const { translations } = localization;

    const theme = useTheme();

    const setSlug = useCallback((action: SetStateAction<string>) => setValue((prevValue) => ({
        ...prevValue,
        slug: getStateActionValue(action, prevValue.slug)
    })), [setValue]);

    const setColor = useCallback((action: SetStateAction<HsvaColor>) => setValue((prevValue) => ({
        ...prevValue,
        color: getStateActionValue(action, prevValue.color)
    })), [setValue]);

    const setName = useCallback((action: SetStateAction<string>) => setValue((prevValue) => ({
        ...prevValue,
        name: getStateActionValue(action, prevValue.name)
    })), [setValue]);

    const setDescription = useCallback((action: SetStateAction<string>) => setValue((prevValue) => ({
        ...prevValue,
        description: getStateActionValue(action, prevValue.description)
    })), [setValue]);

    const handleRemoveButtonClick = useCallback((e: MouseEvent<HTMLButtonElement>) => setValue((prevValue) => ({
        ...prevValue,
        deleted: !prevValue.deleted
    })), [setValue]);

    const handleRestoreButtonClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setValue((prevValue) => ({
            ...prevValue,
            deleted: false
        }));
    }, [setValue]);

    const isEdit = Number.isNaN(Number(id));
    return (
        <SectionAccordionCard
            icon={
                <ColorPickerPreview
                    hsva={color}
                    width={theme.spacing(2)}
                    height={theme.spacing(2)}
                />
            }
            primary={name}
            secondary={String(translations.web_tag_pages).replace('%c', (0).toString())}
            headerChildren={
                deleted && (
                    <Button
                        onClick={handleRestoreButtonClick}
                        onMouseDown={(e) => e.stopPropagation()}
                        variant="outlined"
                        corners="extended"
                        startIcon={<UndoIcon />}
                    >
                        {translations.web_tag_undo_remove}
                    </Button>
                )
            }
            expanded={expanded}
            setExpanded={setExpanded}
            defaultExpanded={_defaultExpanded ?? defaultExpanded}
            disabled={disabled}
            readOnly={readOnly}
            variant={variant}
            className={
                clsx(
                    sectionTagCardClasses.root,
                    deleted && sectionTagCardClasses.deleted,
                    className
                )
            }
            sx={{
                [`& .${sectionCardDisplayClasses.icon} :not(.${avatarClasses.root}):not(#_)`]: {
                    m: 0
                },
                [`& .${sectionCardDisplayClasses.icon} > :not(.${avatarClasses.root}):not(#_)`]: {
                    mx: 1
                },
                [`&.${sectionTagCardClasses.deleted} .${sectionAccordionCardClasses.header} .${sectionButtonCardClasses.root}`]: {
                    [`&:hover:has(.${sectionCardClasses.content} .${buttonClasses.root}:hover)`]: {
                        bgcolor: 'transparent'
                    },
                    [theme.breakpoints.down('md')]: {
                        [`& .${sectionCardClasses.content}`]: {
                            width: '100%',
                            ml: 0,
                            [`& .${buttonClasses.root}`]: {
                                width: '100%'
                            }
                        }
                    }
                },
                ...sx
            }}
            slotProps={{
                items: {
                    unmountOnExit: true
                }
            }}
            {...props}
        >
            <SectionTextFieldCard
                primary={translations.slug}
                secondary={<CodeStyleContainer>{translations.web_tag_slug_description}</CodeStyleContainer>}
                value={slug}
                setValue={setSlug}
                disabled={deleted}
                slotProps={{
                    control: {
                        disabled: deleted || tag?.slug !== undefined
                    }
                }}
            />
            <SectionColorFieldCard
                primary={translations.color}
                secondary={<CodeStyleContainer>{translations.web_tag_color_description}</CodeStyleContainer>}
                value={color}
                setValue={setColor}
                disabled={deleted}
                localization={localization}
            />
            <SectionTextFieldCard
                primary={translations.name}
                secondary={translations.web_tag_name_description}
                value={name}
                setValue={setName}
                disabled={deleted}
            />
            <SectionTextFieldCard
                primary={translations.description}
                secondary={translations.web_tag_description_description}
                value={description}
                setValue={setDescription}
                disabled={deleted}
            />
            <SectionCard>
                <Button
                    onClick={handleRemoveButtonClick}
                    variant="outlined"
                    corners="extended"
                    startIcon={deleted ? <UndoIcon /> : (isEdit ? <DeleteIcon /> : <CloseIcon />)}
                >
                    {deleted ? translations.web_tag_undo_remove : (isEdit ? translations.remove : translations.cancel)}
                </Button>
            </SectionCard>
        </SectionAccordionCard>
    );
};
