'use client';

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
        slotProps
    }: DesktopChannelPickerProps
) => {
    /*
    const searchRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (anchorEl !== undefined)
            setTimeout(() => searchRef.current?.focus());
    }, [anchorEl]);
    */

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
                <VList style={{ padding: 8 }}>
                    {categories.map((category) => (
                        <ChannelPickerGroup
                            key={category?.id}
                            category={category}
                            channels={channels.filter((channel) => channel.parent_id == category?.id)}
                            selected={selected}
                            onClick={onClick}
                        />
                    ))}
                </VList>
            </DesktopPickerContent>
        </DesktopPickerRoot>
    );
};
