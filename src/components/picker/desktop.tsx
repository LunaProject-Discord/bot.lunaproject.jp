'use client';

import { PickerInternalProps, PickerSearchBox } from '@/components/picker';
import { SlotRootProps } from '@lunaproject/web-core/dist/components';
import { SlotComponentProps } from '@mui/base';
import { Box, listClasses, listItemButtonClasses, Popover, popoverClasses, styled } from '@mui/material';
import React, { cloneElement, useCallback } from 'react';
import { VList } from 'virtua';

export const DesktopPickerRoot = styled(Popover)(({ theme }) => ({
    [`& .${popoverClasses.paper}`]: {
        width: 300,
        border: `solid 1px ${theme.palette.divider}`,
        boxShadow: `0 ${theme.spacing(.5)} ${theme.spacing(1)} rgba(0, 0, 0, .15)`
    }
}));

export const DesktopPickerContent = styled(Box)(({ theme }) => ({
    height: 300,
    [`& .${listClasses.root}`]: {
        padding: 0
    },
    [`& .${listItemButtonClasses.root}`]: {
        padding: theme.spacing(.5, 1),
        gap: theme.spacing(1),
        borderRadius: theme.shape.borderRadius
    }
}));

export interface DesktopPickerSlotProps {
    slotProps?: {
        root?: SlotComponentProps<typeof Popover, SlotRootProps, {}>;
        content?: SlotComponentProps<typeof Box, SlotRootProps, {}>;
        searchBox?: SlotComponentProps<typeof PickerSearchBox, SlotRootProps, {}>;
    };
}

export type DesktopPickerProps<T> = PickerInternalProps<T> & DesktopPickerSlotProps;

export const DesktopPicker = <T, >(
    {
        anchorEl,
        setAnchorEl,
        renderChoice,
        getChoiceId,
        choices,
        selected,
        onClick,
        search,
        setSearch,
        slotProps
    }: DesktopPickerProps<T>
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
                    {choices.map((choice, index) => {
                        const id = getChoiceId(choice, index);

                        return cloneElement(
                            renderChoice({
                                index,
                                choice,
                                selected: selected?.includes(id),
                                onClick
                            }),
                            {
                                key: id
                            }
                        );
                    })}
                </VList>
            </DesktopPickerContent>
        </DesktopPickerRoot>
    );
};
