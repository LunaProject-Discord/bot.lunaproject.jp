'use client';

import {
    DesktopPicker,
    DesktopPickerSlotProps,
    getPickerChoices,
    MobilePicker,
    MobilePickerSlotProps,
    PickerSearchBox,
    usePickerSearch
} from '@/components/picker';
import { LocalizationProps } from '@/interfaces/localization';
import { SlotRootProps } from '@lunaproject/web-core/dist/components';
import { SomeRequired } from '@lunaproject/web-core/dist/utils';
import { SlotComponentProps } from '@mui/base';
import { Theme, useMediaQuery } from '@mui/material';
import deepmerge from 'deepmerge';
import React, { Dispatch, MouseEvent, ReactElement, SetStateAction } from 'react';

export type PickerGetChoiceId<T> = (choice: T, index: number) => string;
export type PickerChoiceClickHandler<T> = (event: MouseEvent<HTMLDivElement>, choice: T, index: number) => void;
export type PickerChoiceFilter<T> = (choice: T, search: string) => boolean;

export interface PickerRootProps<T> extends LocalizationProps {
    anchorEl: HTMLElement | undefined;
    setAnchorEl: Dispatch<SetStateAction<HTMLElement | undefined>>;
    renderChoice: (props: PickerItemProps<T>) => ReactElement<PickerItemProps<T>>;
    getChoiceId: PickerGetChoiceId<T>;
    choices: T[];
    selected?: string[];
    onClick?: PickerChoiceClickHandler<T>;
    filter?: PickerChoiceFilter<T>;
    search?: string;
    setSearch?: Dispatch<SetStateAction<string>>;
}

export interface PickerSlotProps {
    slotProps?: {
        desktop?: DesktopPickerSlotProps['slotProps'];
        mobile?: MobilePickerSlotProps['slotProps'];
        searchBox?: SlotComponentProps<typeof PickerSearchBox, SlotRootProps, {}>;
    };
}

export type PickerProps<T> = PickerRootProps<T> & PickerSlotProps;

export type PickerInternalProps<T> = SomeRequired<Omit<PickerRootProps<T>, 'filter'>, 'search' | 'setSearch'>;

export interface PickerItemProps<T> {
    index: number;
    choice: T;
    selected?: boolean;
    onClick?: PickerChoiceClickHandler<T>;
}

export const Picker = <T, >(
    {
        choices: _choices,
        filter,
        search: _search,
        setSearch: _setSearch,
        slotProps,
        ...props
    }: PickerProps<T>
) => {
    const { search, setSearch } = usePickerSearch(_search, _setSearch);
    const choices = getPickerChoices(_choices, search, filter);

    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.up('sm'));
    const pickerProps = { choices, search, setSearch, ...props };

    if (isSmall) {
        return (
            <DesktopPicker<T>
                slotProps={{
                    root: slotProps?.desktop?.root,
                    content: slotProps?.desktop?.content,
                    searchBox: deepmerge<SlotComponentProps<typeof PickerSearchBox, SlotRootProps, {}>>(
                        slotProps?.searchBox ?? {},
                        slotProps?.desktop?.searchBox ?? {}
                    )
                }}
                {...pickerProps}
            />
        );
    } else {
        return (
            <MobilePicker<T>
                slotProps={{
                    root: slotProps?.mobile?.root,
                    content: slotProps?.mobile?.content,
                    searchBox: deepmerge<SlotComponentProps<typeof PickerSearchBox, SlotRootProps, {}>>(
                        slotProps?.searchBox ?? {},
                        slotProps?.mobile?.searchBox ?? {}
                    )
                }}
                {...pickerProps}
            />
        );
    }
};

export * from './channel';
export * from './guild';
export * from './member';
export * from './role';
export * from './snowflake';

export * from './desktop';
export * from './mobile';
export * from './search_box';
export * from './utils';
