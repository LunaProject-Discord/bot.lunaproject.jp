import { SnowflakePickerRootType } from '@/components/picker';
import { LocalizationProps } from '@/interfaces/localization';
import { SectionCardDisabledProps, SectionCardVariableProps } from '@lunaproject/web-core/dist/components';
import { BoxProps } from '@mui/material';

export interface SnowflakeSelectRootProps<T extends SnowflakePickerRootType> extends SectionCardDisabledProps, LocalizationProps {
    choices: T[];
    multiple?: boolean;
}

export interface SingleSnowflakeSelectProps<T extends SnowflakePickerRootType> extends SnowflakeSelectRootProps<T>, SectionCardVariableProps<{
    value: string;
}> {
    multiple?: false;
}

export interface MultipleSnowflakeSelectProps<T extends SnowflakePickerRootType> extends SnowflakeSelectRootProps<T>, SectionCardVariableProps<{
    value: string[];
}> {
    multiple: true;
}

export type SnowflakeSelectProps<T extends SnowflakePickerRootType> =
    SingleSnowflakeSelectProps<T>
    | MultipleSnowflakeSelectProps<T>;

export interface SelectInputRootProps {
    open: boolean;
    disabled: boolean;
}

export type SelectInputProps = BoxProps & Partial<SelectInputRootProps>;

export * from './channel';
export * from './guild';
export * from './member';
export * from './role';

export * from './outlined';
