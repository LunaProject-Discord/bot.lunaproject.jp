import { SnowflakePickerRootType } from '@/components/picker';
import { MultipleSelectProps, SelectRootProps, SingleSelectProps } from '@/components/select';

export type SnowflakeSelectRootProps<T extends SnowflakePickerRootType> = SelectRootProps<T>;

export type SingleSnowflakeSelectProps<T extends SnowflakePickerRootType> = SingleSelectProps<T>;

export type MultipleSnowflakeSelectProps<T extends SnowflakePickerRootType> = MultipleSelectProps<T>;

export type SnowflakeSelectProps<T extends SnowflakePickerRootType> =
    SingleSnowflakeSelectProps<T>
    | MultipleSnowflakeSelectProps<T>;

export * from './channel';
export * from './guild';
export * from './member';
export * from './role';
