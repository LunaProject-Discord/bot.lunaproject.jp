'use client';

import {
    getMobilePickerDefaultSnap,
    getMobilePickerSnapPoints,
    PickerInternalProps,
    PickerSearchBox,
    pickerSearchBoxClasses,
    useMobilePickerRef
} from '@/components/picker';
import { BottomSheet, BottomSheetContent } from '@lunaproject/web-core/dist/components/BottomSheet';
import { SlotRootProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { SlotComponentProps } from '@mui/base';
import { Box, BoxProps, listClasses, listItemButtonClasses, listSubheaderClasses, styled } from '@mui/material';
import React, { cloneElement } from 'react';
import { Virtualizer } from 'virtua';

export const MobilePickerRoot = styled(BottomSheet)(({ theme }) => ({
    '& [data-rsbs-header]': {
        zIndex: 2,
        [`& .${pickerSearchBoxClasses.root}`]: {
            margin: theme.spacing(0, -2),
            padding: theme.spacing(1.25, 2)
        }
    },
    '& [data-rsbs-scroll]': {
        overflow: 'auto',
        zIndex: 1,
        '& [data-rsbs-content]': {
            overflow: 'unset'
        }
    }
}));

export const MobilePickerContent = styled(BottomSheetContent)(({ theme }) => ({
    height: '100%',
    padding: theme.spacing(1, 0),
    gap: 0,
    [`& .${listClasses.root}`]: {
        padding: 0
    },
    [`& .${listSubheaderClasses.root}`]: {
        padding: theme.spacing(1.5, 2, .5)
    },
    [`& .${listItemButtonClasses.root}`]: {
        padding: theme.spacing(1, 2),
        gap: theme.spacing(2)
    }
}));

export interface MobilePickerSlotProps {
    slotProps?: {
        root?: SlotComponentProps<typeof BottomSheet, SlotRootProps, {}>;
        content?: SlotComponentProps<typeof Box, BoxProps, {}>;
        searchBox?: SlotComponentProps<typeof PickerSearchBox, SlotRootProps, {}>;
    };
}

export type MobilePickerProps<T> = PickerInternalProps<T> & MobilePickerSlotProps;

export const MobilePicker = <T, >(
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
    }: MobilePickerProps<T>
) => {
    const { sheetScrollRef, setSheetContentRef } = useMobilePickerRef();

    return (
        <MobilePickerRoot
            open={anchorEl !== undefined}
            onDismiss={() => setAnchorEl(undefined)}
            expandOnContentDrag
            defaultSnap={getMobilePickerDefaultSnap}
            snapPoints={getMobilePickerSnapPoints}
            initialFocusRef={false}
            header={
                <PickerSearchBox
                    value={search}
                    setValue={setSearch}
                    {...slotProps?.searchBox}
                />
            }
            {...slotProps?.root}
        >
            <MobilePickerContent ref={setSheetContentRef} {...slotProps?.content}>
                <Virtualizer scrollRef={sheetScrollRef} overscan={2}>
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
                </Virtualizer>
            </MobilePickerContent>
        </MobilePickerRoot>
    );
};
