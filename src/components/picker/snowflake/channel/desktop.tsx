'use client';

import { ErrorDescription, ErrorRoot, ErrorTitle } from '@/components/error';
import { CloudOffIcon } from '@/components/icons';
import {
    ChannelPickerGroup,
    ChannelPickerInternalProps,
    DesktopPickerContent,
    DesktopPickerRoot,
    DesktopPickerSlotProps,
    PickerSearchBox
} from '@/components/picker';
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
        slotProps,
        localization: { translations }
    }: DesktopChannelPickerProps
) => {
    const focusInput = useCallback((input: HTMLInputElement | null) => {
        if (anchorEl !== undefined && input)
            setTimeout(() => input.focus());
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
            <PickerSearchBox
                ref={focusInput}
                value={search}
                setValue={setSearch}
                {...slotProps?.searchBox}
            />
            <DesktopPickerContent {...slotProps?.content}>
                {channels.length > 0 ? <VList style={{ padding: 8, paddingTop: 0 }}>
                    {categories.map((category) => (
                        <ChannelPickerGroup
                            key={category?.id}
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
