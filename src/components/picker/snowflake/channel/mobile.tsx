'use client';

import { ErrorDescription, ErrorRoot, ErrorTitle } from '@/components/error';
import { CloudOffIcon } from '@/components/icons';
import {
    ChannelPickerGroup,
    ChannelPickerInternalProps,
    getMobilePickerDefaultSnap,
    getMobilePickerSnapPoints,
    MobilePickerContent,
    MobilePickerRoot,
    MobilePickerSlotProps,
    PickerSearchBox,
    useMobilePickerRef
} from '@/components/picker';
import React from 'react';
import { Virtualizer } from 'virtua';

export type MobileChannelPickerProps = ChannelPickerInternalProps & MobilePickerSlotProps;

export const MobileChannelPicker = (
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
    }: MobileChannelPickerProps
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
            <MobilePickerContent ref={setSheetContentRef} sx={{ pt: 0 }} {...slotProps?.content}>
                {channels.length > 0 ? <Virtualizer scrollRef={sheetScrollRef} overscan={2}>
                    {categories.map((category) => (
                        <ChannelPickerGroup
                            key={category?.id}
                            category={category}
                            channels={channels.filter((channel) => channel.parent_id == category?.id)}
                            selected={selected}
                            onClick={onClick}
                        />
                    ))}
                </Virtualizer> : <ErrorRoot>
                    <CloudOffIcon sx={{ fontSize: '7rem' }} />
                    <ErrorTitle variant="h3">{translations.error_data_not_found_title}</ErrorTitle>
                    <ErrorDescription variant="body2">{translations.error_data_not_found_description}</ErrorDescription>
                </ErrorRoot>}
            </MobilePickerContent>
        </MobilePickerRoot>
    );
};
