'use client';

import { getSnowflakeChoiceId, Picker, PickerInternalProps, PickerItemProps, PickerProps } from '@/components/picker';
import { SectionCardDisabledProps } from '@lunaproject/web-core/dist/components/SectionCard';
import React from 'react';

export type SnowflakePickerRootType = ({ id: string } | { user: { id: string } }) & SectionCardDisabledProps;

export type SnowflakePickerProps<T extends SnowflakePickerRootType> = Omit<PickerProps<T>, 'getChoiceId'>;

export type SnowflakePickerInternalProps<T extends SnowflakePickerRootType> = Omit<PickerInternalProps<T>, 'getChoiceId'>;

export type SnowflakePickerItemProps<T extends SnowflakePickerRootType> = PickerItemProps<T>;

export const SnowflakePicker = <T extends SnowflakePickerRootType, >(props: SnowflakePickerProps<T>) => (
    <Picker
        getChoiceId={getSnowflakeChoiceId}
        {...props}
    />
);

export * from './channel';
export * from './desktop';
// export * from './emoji';
export * from './guild';
export * from './member';
export * from './mobile';
export * from './role';
export * from './utils';
