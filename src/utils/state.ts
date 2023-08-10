import { SetStateAction, useState } from 'react';

export const useForceUpdate = () => {
    const [count, setCount] = useState(0);
    return () => setCount((prevState) => prevState + 1);
};

export const getStateActionValue = <T>(action: SetStateAction<T>, prevValue: T): T => typeof action === 'function' ? (action as (prevState: T) => T)(prevValue) : action;

export interface UniqueId {
    _id: string;
}
