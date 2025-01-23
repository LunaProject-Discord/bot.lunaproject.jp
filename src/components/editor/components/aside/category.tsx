'use client';

import { EditorSelectButton, EditorSelectButtonContent, EditorSelectButtonLabel } from '@/components/editor';
import { CategoryPicker, CategoryPickerType, ColorPickerPreview } from '@/components/picker';
import { Category } from '@/components/section_card';
import { GuildWebCategory } from '@/interfaces/bot';
import { LocalizationProps } from '@/interfaces/localization';
import { SectionCardDisabledProps, SectionCardVariableProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { alpha, Box, Chip, chipClasses, Typography, useTheme } from '@mui/material';
import { hexToHsva } from '@uiw/react-color';
import { size } from 'polished';
import React, { Fragment, MouseEvent, useCallback, useMemo, useState } from 'react';

export interface EditorCategorySelectButtonProps extends SectionCardDisabledProps, SectionCardVariableProps<{
    value: string | undefined;
}>, LocalizationProps {
    categories: GuildWebCategory[];
}

export const EditorCategorySelectButton = (
    {
        value,
        setValue,
        categories,
        disabled,
        localization
    }: EditorCategorySelectButtonProps
) => {
    const { translations } = localization;

    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined);

    const choices = useMemo(() => categories.map((category): Category => ({
        id: category.id,
        slug: category.slug || '',
        color: hexToHsva(category.color || '#00000000'),
        name: category.name,
        description: category.description,
        parentId: category.parent?.id ?? null,
        deleted: false
    })).toSorted((a, b) => a.name.localeCompare(b.name)), [categories]);

    const handlePickerChoiceClick = useCallback((e: MouseEvent<HTMLDivElement>, category: CategoryPickerType) => {
        setValue((prevValue) => category.id !== prevValue ? category.id : undefined);

        if (!e.shiftKey)
            setAnchorEl(undefined);
    }, [setValue]);

    const category = categories.find((choice) => choice.id === value);
    const categoryColorAlpha = hexToHsva(category?.color || '#00000000').a;

    return (
        <Fragment>
            <EditorSelectButton onClick={(e) => setAnchorEl(e.currentTarget)} disabled={disabled}>
                <EditorSelectButtonLabel>{translations.category}</EditorSelectButtonLabel>
                <EditorSelectButtonContent>
                    {category ? <Chip
                        icon={
                            categoryColorAlpha > 0 ? <Box
                                sx={{
                                    ...size(24),
                                    display: 'flex',
                                    flexShrink: 0,
                                    placeItems: 'center',
                                    placeContent: 'center'
                                }}
                            >
                                <ColorPickerPreview
                                    hsva={hexToHsva(category.color)}
                                    width={theme.spacing(1.5)}
                                    height={theme.spacing(1.5)}
                                />
                            </Box> : undefined
                        }
                        label={category.name}
                        sx={(theme) => {
                            if (categoryColorAlpha === 0)
                                return {};

                            return {
                                bgcolor: alpha(category.color, .12),
                                ...theme.applyStyles('dark', {
                                    bgcolor: alpha(category.color, .24)
                                }),
                                [`& .${chipClasses.label}`]: {
                                    pl: 1
                                }
                            };
                        }}
                    /> : <Typography>{translations.uncategorized}</Typography>}
                </EditorSelectButtonContent>
            </EditorSelectButton>

            <CategoryPicker
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                choices={choices}
                selected={category ? [category.id] : []}
                onClick={handlePickerChoiceClick}
                slotProps={{
                    desktop: {
                        root: {
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'right'
                            },
                            transformOrigin: {
                                vertical: 'top',
                                horizontal: 'right'
                            }
                        }
                    }
                }}
                localization={localization}
            />
        </Fragment>
    );
};
