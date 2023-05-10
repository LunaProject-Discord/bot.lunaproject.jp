import { Dispatch, SetStateAction } from 'react';

export interface DialogProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export * from './manage_disabled_channels';
export * from './manage_disabled_roles';
