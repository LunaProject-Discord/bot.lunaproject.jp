import { SetStateAction } from 'react';

export const getStateActionValue = <T>(action: SetStateAction<T>, prevValue: T): T => typeof action === 'function' ? (action as (prevState: T) => T)(prevValue) : action;

export interface UniqueId {
    _id: string;
}
