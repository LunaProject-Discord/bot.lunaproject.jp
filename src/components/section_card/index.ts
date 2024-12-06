import { LocalizationProps } from '@/interfaces/localization';
import {
    SectionCardDisabledProps,
    SectionCardProps,
    SectionCardVariableProps
} from '@lunaproject/web-core/dist/components/SectionCard';

export interface SectionControlCardSlotProps<T extends { slotProps?: {} }> {
    slotProps?: {
        control?: T['slotProps'];
    };
}

export interface SectionSelectCardRootProps<T> extends SectionCardDisabledProps, LocalizationProps {
    choices: T[];
    multiple?: boolean;
}

export interface SingleSectionSelectCardRootProps<T> extends SectionSelectCardRootProps<T>, SectionCardVariableProps<{
    value: string;
}> {
    multiple?: false;
}

export interface MultipleSectionSelectCardRootProps<T> extends SectionSelectCardRootProps<T>, SectionCardVariableProps<{
    value: string[];
}> {
    multiple: true;
}

export type SectionSelectCardProps<T, P extends { slotProps?: {} }> =
    SectionCardProps
    & SectionControlCardSlotProps<P>
    & (SingleSectionSelectCardRootProps<T> | MultipleSectionSelectCardRootProps<T>);

export * from './snowflake/channel';
export * from './color';
export * from './snowflake/guild';
export * from './level';
export * from './snowflake/member';
export * from './message';
export * from './snowflake/role';
export * from './snowflake';
export * from './web';
