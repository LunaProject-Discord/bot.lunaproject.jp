'use client';

import { ErrorDescription, ErrorRoot, ErrorTitle } from '@/components/error';
import { CloudOffIcon } from '@/components/icons';
import { PickerInternalProps, PickerSearchBox } from '@/components/picker';
import { SlotRootProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { borderAndBoxShadow } from '@lunaproject/web-core/dist/utils';
import { SlotComponentProps } from '@mui/base';
import { Box, listClasses, listItemButtonClasses, Popover, popoverClasses, styled } from '@mui/material';
import React, { cloneElement, useCallback } from 'react';
import { VList } from 'virtua';

export const DesktopPickerRoot = styled(Popover)(({ theme }) => ({
    [`& .${popoverClasses.paper}`]: {
        width: 300,
        ...borderAndBoxShadow(theme)
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
        slotProps,
        localization: { translations }
    }: DesktopPickerProps<T>
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
            <PickerSearchBox
                ref={focusInput}
                value={search}
                setValue={setSearch}
                {...slotProps?.searchBox}
            />
            <DesktopPickerContent {...slotProps?.content}>
                {choices.length > 0 ? <VList style={{ padding: 8 }}>
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
                </VList> : <ErrorRoot>
                    <CloudOffIcon sx={{ fontSize: '7rem' }} />
                    <ErrorTitle variant="h3">{translations.error_data_not_found_title}</ErrorTitle>
                    <ErrorDescription variant="body2">{translations.error_data_not_found_description}</ErrorDescription>
                </ErrorRoot>}
            </DesktopPickerContent>
        </DesktopPickerRoot>
    );
};
