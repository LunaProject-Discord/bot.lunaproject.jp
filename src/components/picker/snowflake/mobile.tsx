'use client';

import {
    getSnowflakeChoiceId,
    MobilePicker,
    MobilePickerSlotProps,
    SnowflakePickerInternalProps,
    SnowflakePickerRootType
} from '@/components/picker';
import React from 'react';

export type MobileSnowflakePickerProps<T extends SnowflakePickerRootType> =
    SnowflakePickerInternalProps<T>
    & MobilePickerSlotProps;

export const MobileSnowflakePicker = <T extends SnowflakePickerRootType, >(props: MobileSnowflakePickerProps<T>) => (
    <MobilePicker
        getChoiceId={getSnowflakeChoiceId}
        {...props}
    />
);
