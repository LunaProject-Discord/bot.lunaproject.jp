'use client';

import { CloseIcon, DeleteIcon, UndoIcon } from '@/components/icons';
import { ColorPickerPreview } from '@/components/picker';
import { SectionColorFieldCard } from '@/components/section_card';
import { CategorySelect } from '@/components/select';
import { CodeStyleContainer } from '@/components/text';
import { GuildWebCategory } from '@/interfaces/bot';
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

export interface Category {
    id: string;
    slug: string;
    color: HsvaColor;
    name: string;
    description: string;
    parentId: string | null;
    deleted: boolean;
    _defaultExpanded?: boolean;
}

export const sectionCategoryCardClasses = generateComponentClasses(
    'SectionCategoryCard',
    [
        'root',

        'deleted'
    ]
);

export interface SectionCategoryCardRootProps extends SectionCardVariableProps<{
    value: Category;
}>, LocalizationProps {
    category?: GuildWebCategory;
    categories: Category[];
}

export type SectionCategoryCardProps =
    & Pick<SectionCardProps, 'disabled' | 'variant' | 'className' | 'sx'>
    & Omit<SectionAccordionCardRootProps, 'header' | 'headerChildren'>
    & SectionCategoryCardRootProps;

export const SectionCategoryCard = (
    {
        value: {
            id,
            slug,
            color,
            name,
            description,
            parentId,
            deleted,
            _defaultExpanded
        },
        setValue,
        category,
        categories,
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
    }: SectionCategoryCardProps
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

    const setParentId = useCallback((action: SetStateAction<string[]>) => setValue((prevValue) => {
        const ids = typeof action === 'function' ? action(prevValue.parentId ? [prevValue.parentId] : []) : action;
        return {
            ...prevValue,
            parentId: ids.length > 0 ? ids[ids.length - 1] : null
        };
    }), [setValue]);

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

    const hasAncestor = (category: Category, id: string | null): boolean => {
        if (!category.parentId)
            return false;
        if (category.parentId === id)
            return true;

        const parentCategory = categories.find((cat) => cat.id === category.parentId);
        return parentCategory !== undefined && hasAncestor(parentCategory, id);
    };

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
            secondary={String(translations.web_category_pages).replace('%c', (category?.pageCount ?? 0).toString())}
            headerChildren={
                deleted && (
                    <Button
                        onClick={handleRestoreButtonClick}
                        onMouseDown={(e) => e.stopPropagation()}
                        variant="outlined"
                        corners="extended"
                        startIcon={<UndoIcon />}
                    >
                        {translations.web_category_undo_remove}
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
                    sectionCategoryCardClasses.root,
                    deleted && sectionCategoryCardClasses.deleted,
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
                [`&.${sectionCategoryCardClasses.deleted} .${sectionAccordionCardClasses.header} .${sectionButtonCardClasses.root}`]: {
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
                secondary={<CodeStyleContainer>{translations.web_category_slug_description}</CodeStyleContainer>}
                value={slug}
                setValue={setSlug}
                disabled={deleted}
                slotProps={{
                    control: {
                        disabled: deleted || category?.slug !== undefined
                    }
                }}
            />
            <SectionColorFieldCard
                primary={translations.color}
                secondary={<CodeStyleContainer>{translations.web_category_color_description}</CodeStyleContainer>}
                value={color}
                setValue={setColor}
                disabled={deleted}
                localization={localization}
            />
            <SectionTextFieldCard
                primary={translations.name}
                secondary={translations.web_category_name_description}
                value={name}
                setValue={setName}
                disabled={deleted}
            />
            <SectionTextFieldCard
                primary={translations.description}
                secondary={translations.web_category_description_description}
                value={description}
                setValue={setDescription}
                disabled={deleted}
            />
            <SectionCard
                primary={translations.web_category_parent_category}
                disabled={deleted}
                sx={{
                    flexWrap: 'nowrap',
                    [theme.breakpoints.down('md')]: {
                        flexWrap: 'wrap',
                        [`& .${sectionCardClasses.content}`]: {
                            width: '100%'
                        }
                    }
                }}
            >
                <CategorySelect
                    value={parentId ? [parentId] : []}
                    setValue={setParentId}
                    choices={categories.filter((category) => category.id !== id && !hasAncestor(category, id) && !category.deleted)}
                    multiple
                    disabled={deleted || !isEdit}
                    slotProps={{
                        input: {
                            root: {
                                sx: {
                                    width: { xs: '100%', md: 300 }
                                }
                            }
                        }
                    }}
                    localization={localization}
                />
            </SectionCard>
            <SectionCard>
                <Button
                    onClick={handleRemoveButtonClick}
                    variant="outlined"
                    corners="extended"
                    startIcon={deleted ? <UndoIcon /> : (isEdit ? <DeleteIcon /> : <CloseIcon />)}
                >
                    {deleted ? translations.web_category_undo_remove : (isEdit ? translations.remove : translations.cancel)}
                </Button>
            </SectionCard>
        </SectionAccordionCard>
    );
};
