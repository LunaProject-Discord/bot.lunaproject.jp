'use client';

import { ColorPickerPreview } from '@/components/picker';
import { Category } from '@/components/section_card';
import { LocalizationProps } from '@/interfaces/localization';
import {
    Picker,
    PickerItem,
    PickerItemIcon,
    PickerItemProps,
    PickerItemText,
    PickerProps
} from '@lunaproject/web-core/dist/components/Picker';
import { SectionCardDisabledProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { useTheme } from '@mui/material';
import deepmerge from 'lodash/merge';
import React, { MouseEvent, useCallback } from 'react';

export type CategoryPickerType = Category & SectionCardDisabledProps;

export type CategoryPickerProps =
    Omit<PickerProps<CategoryPickerType>, 'renderChoice' | 'getChoiceId' | 'filter'>
    & LocalizationProps;

export type CategoryPickerItemProps = PickerItemProps<CategoryPickerType>;

export const CategoryPickerItem = (
    {
        index,
        choice: category,
        selected,
        onClick
    }: CategoryPickerItemProps
) => {
    const theme = useTheme();

    const handleClick = (e: MouseEvent<HTMLDivElement>) => onClick?.(e, category, index);

    return (
        <PickerItem onClick={handleClick} selected={selected} disabled={category.disabled}>
            <PickerItemIcon>
                <ColorPickerPreview
                    hsva={category.color}
                    width={theme.spacing(2)}
                    height={theme.spacing(2)}
                />
            </PickerItemIcon>
            <PickerItemText primary={category.name} />
        </PickerItem>
    );
};

export const CategoryPicker = (
    {
        choices: _choices,
        onClick,
        slotProps,
        localization: { translations },
        ...props
    }: CategoryPickerProps
) => {
    const choices = _choices.toSorted((a, b) => a.name.localeCompare(b.name));

    const filterPredicate = useCallback((category: CategoryPickerType, keyword: string) => keyword.length < 1
        || category.id.includes(keyword)
        || category.name.toLowerCase().includes(keyword.toLowerCase()), []);

    const handleChoiceClick = useCallback((e: MouseEvent<HTMLElement>, category: CategoryPickerType, index: number) => {
        onClick?.(e, category, index);
    }, [onClick]);

    return (
        <Picker
            renderChoice={CategoryPickerItem}
            getChoiceId={(choice) => choice.id}
            choices={choices}
            onClick={handleChoiceClick}
            filter={filterPredicate}
            slotProps={
                deepmerge(
                    {
                        searchBox: {
                            placeholder: translations.search as string
                        }
                    },
                    slotProps ?? {}
                )
            }
            {...props}
        />
    );
};
