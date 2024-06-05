import { SnowflakePickerRootType } from '@/components/picker';
import { LocalizationProps } from '@/interfaces/localization';
import {
    SectionCardDisabledProps,
    SectionCardProps,
    SectionCardVariableProps
} from '@lunaproject/web-core/dist/components/SectionCard';

export interface SectionSnowflakeSelectCardRootProps<T extends SnowflakePickerRootType> extends SectionCardDisabledProps, LocalizationProps {
    choices: T[];
    multiple?: boolean;
}

export interface SingleSectionSnowflakeSelectCardRootProps<T extends SnowflakePickerRootType> extends SectionSnowflakeSelectCardRootProps<T>, SectionCardVariableProps<{
    value: string;
}> {
    multiple?: false;
}

export interface MultipleSectionSnowflakeSelectCardRootProps<T extends SnowflakePickerRootType> extends SectionSnowflakeSelectCardRootProps<T>, SectionCardVariableProps<{
    value: string[];
}> {
    multiple: true;
}

export interface SectionSnowflakeSelectCardSlotProps<T extends { slotProps?: {} }> {
    slotProps?: {
        control?: T['slotProps'];
    };
}

export type SectionSnowflakeSelectCardProps<T extends SnowflakePickerRootType, P extends { slotProps?: {} }> =
    SectionCardProps
    & (SingleSectionSnowflakeSelectCardRootProps<T> | MultipleSectionSnowflakeSelectCardRootProps<T>)
    & SectionSnowflakeSelectCardSlotProps<P>;

export * from './channel';
export * from './guild';
export * from './level';
export * from './member';
export * from './message';
export * from './role';
