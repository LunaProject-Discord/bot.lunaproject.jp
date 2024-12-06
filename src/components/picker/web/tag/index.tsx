'use client';

import {
    ColorPickerPreview,
    Picker,
    PickerItemIcon,
    PickerItemProps,
    PickerItemText,
    PickerProps
} from '@/components/picker';
import { Tag } from '@/components/section_card';
import { SectionCardDisabledProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { ListItemButton, useTheme } from '@mui/material';
import deepmerge from 'deepmerge';
import React, { MouseEvent, useCallback } from 'react';

export type TagPickerType = Tag & SectionCardDisabledProps;

export type TagPickerProps = Omit<PickerProps<TagPickerType>, 'renderChoice' | 'getChoiceId' | 'filter'>;

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
        <ListItemButton onClick={handleClick} selected={selected} disabled={tag.disabled}>
            <PickerItemIcon>
                <ColorPickerPreview
                    hsva={tag.color}
                    width={theme.spacing(2)}
                    height={theme.spacing(2)}
                />
            </PickerItemIcon>
            <PickerItemText primary={tag.name} />
        </ListItemButton>
    );
};

export const TagPicker = (
    {
        choices: _choices,
        onClick,
        slotProps,
        ...props
    }: TagPickerProps
) => {
    const { translations } = props.localization;

    const choices = _choices.toSorted((a, b) => a.name.localeCompare(b.name));

    const filterPredicate = useCallback((tag: TagPickerType, keyword: string) => keyword.length < 1
        || tag.id.includes(keyword)
        || tag.name.toLowerCase().includes(keyword.toLowerCase()), []);

    const handleChoiceClick = useCallback((e: MouseEvent<HTMLDivElement>, tag: TagPickerType, index: number) => {
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
                deepmerge<TagPickerProps['slotProps']>(
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
