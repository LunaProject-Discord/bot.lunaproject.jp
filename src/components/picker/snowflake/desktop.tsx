'use client';

import {
    DesktopPicker,
    DesktopPickerSlotProps,
    getSnowflakeChoiceId,
    SnowflakePickerInternalProps,
    SnowflakePickerRootType
} from '@/components/picker';
import React from 'react';

export type DesktopSnowflakePickerProps<T extends SnowflakePickerRootType> =
    SnowflakePickerInternalProps<T>
    & DesktopPickerSlotProps;

export const DesktopSnowflakePicker = <T extends SnowflakePickerRootType, >(props: DesktopSnowflakePickerProps<T>) => (
    <DesktopPicker
        getChoiceId={getSnowflakeChoiceId}
        {...props}
    />
);
