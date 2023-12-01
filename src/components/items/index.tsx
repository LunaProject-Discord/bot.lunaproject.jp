'use client';

import { ItemVariableProps } from '@lunaproject/web-core/dist/components/SectionItems';
import { DispatchWithoutAction } from 'react';

export interface ItemResettableVariableProps<T> extends ItemVariableProps<T> {
    resetValue: DispatchWithoutAction;
}

export * from '@lunaproject/web-core/dist/components/SectionItems';

export * from './discord';
