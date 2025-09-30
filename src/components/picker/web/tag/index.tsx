'use client';

import { ColorPickerPreview } from '@/components/picker';
import { Tag } from '@/components/section_card';
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

export type TagPickerType = Tag & SectionCardDisabledProps;

export type TagPickerProps =
    Omit<PickerProps<TagPickerType>, 'renderChoice' | 'getChoiceId' | 'filter'>
    & LocalizationProps;

export type TagPickerItemProps = PickerItemProps<TagPickerType>;

export const TagPickerItem = (
    {
        index,
        choice: tag,
        selected,
        onClick
    }: TagPickerItemProps
) => {
    const theme = useTheme();

    const handleClick = (e: MouseEvent<HTMLDivElement>) => onClick?.(e, tag, index);

    return (
        <PickerItem onClick={handleClick} selected={selected} disabled={tag.disabled}>
            <PickerItemIcon>
                <ColorPickerPreview
                    hsva={tag.color}
                    width={theme.spacing(2)}
                    height={theme.spacing(2)}
                />
            </PickerItemIcon>
            <PickerItemText primary={tag.name} />
        </PickerItem>
    );
};

export const TagPicker = (
    {
        choices: _choices,
        onClick,
        slotProps,
        localization: { translations },
        ...props
    }: TagPickerProps
) => {
    const choices = _choices.toSorted((a, b) => a.name.localeCompare(b.name));

    const filterPredicate = useCallback((tag: TagPickerType, keyword: string) => keyword.length < 1
        || tag.id.includes(keyword)
        || tag.name.toLowerCase().includes(keyword.toLowerCase()), []);

    const handleChoiceClick = useCallback((e: MouseEvent<HTMLElement>, tag: TagPickerType, index: number) => {
        onClick?.(e, tag, index);
    }, [onClick]);

    return (
        <Picker
            renderChoice={TagPickerItem}
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
