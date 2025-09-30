'use client';

import { ErrorDescription, ErrorRoot, ErrorTitle } from '@/components/error';
import { CloudOffIcon } from '@/components/icons';
import { ChannelPickerGroup, ChannelPickerInternalProps } from '@/components/picker';
import {
    DesktopPickerContent,
    DesktopPickerRoot,
    DesktopPickerSlotProps,
    PickerSearchBox
} from '@lunaproject/web-core/dist/components/Picker';
import React, { useCallback } from 'react';
import { VList } from 'virtua';

export type DesktopChannelPickerProps = ChannelPickerInternalProps & DesktopPickerSlotProps;

export const DesktopChannelPicker = (
    {
        anchorEl,
        setAnchorEl,
        categories,
        channels,
        selected,
        onClick,
        search,
        setSearch,
        disableSearch,
        slotProps,
        localization: { translations }
    }: DesktopChannelPickerProps
) => {
    const focusInput = useCallback((element: HTMLInputElement | null) => {
        if (anchorEl !== undefined && element)
            setTimeout(() => element.focus());
    }, [anchorEl]);

    return (
        <DesktopPickerRoot
            open={anchorEl !== undefined}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(undefined)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            {...slotProps?.root}
        >
            {!disableSearch && <PickerSearchBox
                ref={focusInput}
                value={search}
                setValue={setSearch}
                {...slotProps?.searchBox}
            />}
            <DesktopPickerContent {...slotProps?.content}>
                {channels.length > 0 ? <VList style={{ paddingBottom: 8 }}>
                    {categories.map((category) => (
                        <ChannelPickerGroup
                            key={category?.id ?? 'uncategorized'}
                            category={category}
                            channels={channels.filter((channel) => channel.parent_id == category?.id)}
                            selected={selected}
                            onClick={onClick}
                        />
                    ))}
                </VList> : <ErrorRoot>
                    <CloudOffIcon sx={{ fontSize: '7rem' }} />
                    <ErrorTitle variant="h3">{translations.error_data_not_found_title}</ErrorTitle>
                    <ErrorDescription variant="body2">{translations.error_data_not_found_description}</ErrorDescription>
                </ErrorRoot>}
            </DesktopPickerContent>
        </DesktopPickerRoot>
    );
};
