import { SnowflakePickerRootType } from '@/components/picker';
import {
    MultipleSectionSelectCardRootProps,
    SectionControlCardSlotProps,
    SectionSelectCardRootProps,
    SingleSectionSelectCardRootProps
} from '@/components/section_card';
import { SectionCardProps } from '@lunaproject/web-core/dist/components/SectionCard';

export type SectionSnowflakeSelectCardRootProps<T extends SnowflakePickerRootType> = SectionSelectCardRootProps<T>;

export type SingleSectionSnowflakeSelectCardRootProps<T extends SnowflakePickerRootType> = SingleSectionSelectCardRootProps<T>;

export type MultipleSectionSnowflakeSelectCardRootProps<T extends SnowflakePickerRootType> = MultipleSectionSelectCardRootProps<T>;

export type SectionSnowflakeSelectCardProps<T extends SnowflakePickerRootType, P extends { slotProps?: {} }> =
    SectionCardProps
    & SectionControlCardSlotProps<P>
    & (SingleSectionSnowflakeSelectCardRootProps<T> | MultipleSectionSnowflakeSelectCardRootProps<T>);

export * from './channel';
// export * from './emoji';
export * from './guild';
export * from './member';
export * from './role';
