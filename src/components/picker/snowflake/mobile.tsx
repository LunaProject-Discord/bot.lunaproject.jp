'use client';

import { getSnowflakeChoiceId, SnowflakePickerInternalProps, SnowflakePickerRootType } from '@/components/picker';
import { MobilePicker, MobilePickerSlotProps } from '@lunaproject/web-core/dist/components/Picker';
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
