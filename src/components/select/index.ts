import { LocalizationProps } from '@/interfaces/localization';
import { SectionCardDisabledProps, SectionCardVariableProps } from '@lunaproject/web-core/dist/components/SectionCard';

export interface SelectRootProps<T> extends SectionCardDisabledProps, LocalizationProps {
    choices: T[];
    multiple?: boolean;
}

export interface SingleSelectProps<T> extends SelectRootProps<T>, SectionCardVariableProps<{ value: string; }> {
    multiple?: false;
}

export interface MultipleSelectProps<T> extends SelectRootProps<T>, SectionCardVariableProps<{ value: string[]; }> {
    multiple: true;
}

export type SelectProps<T> = SingleSelectProps<T> | MultipleSelectProps<T>;

export * from './snowflake';
export * from './web';
