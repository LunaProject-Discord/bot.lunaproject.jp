'use client';

import { MemberPickerType } from '@/components/picker';
import { SectionSnowflakeSelectCardProps } from '@/components/section_card';
import { MemberSelect, MemberSelectProps } from '@/components/select';
import {
    generateSectionControlCardClasses,
    SectionCard,
    sectionCardClasses
} from '@lunaproject/web-core/dist/components/SectionCard';
import { useTheme } from '@mui/material';
import clsx from 'clsx';
import deepmerge from 'deepmerge';
import React from 'react';

export const sectionMemberSelectCardClasses = generateSectionControlCardClasses('Member');

export type SectionMemberSelectCardProps = SectionSnowflakeSelectCardProps<MemberPickerType, MemberSelectProps>;

export const SectionMemberSelectCard = (
    {
        children,
        value,
        setValue,
        choices,
        multiple,
        disabled,
        variant,
        className,
        sx,
        slots,
        slotProps: { control, ...slotProps } = {},
        localization,
        ...props
    }: SectionMemberSelectCardProps
) => {
    const theme = useTheme();

    return (
        <SectionCard
            disabled={disabled}
            variant={variant}
            className={clsx(sectionMemberSelectCardClasses.root, className)}
            sx={{
                flexWrap: 'nowrap',
                [theme.breakpoints.down('md')]: {
                    flexWrap: 'wrap',
                    [`& .${sectionCardClasses.content}`]: {
                        width: '100%'
                    }
                },
                ...sx
            }}
            slots={slots}
            slotProps={slotProps}
            {...props}
        >
            {children}
            {/* @ts-ignore */}
            <MemberSelect
                value={value}
                setValue={setValue}
                choices={choices}
                multiple={multiple}
                disabled={disabled}
                slotProps={
                    deepmerge<MemberSelectProps['slotProps']>(
                        {
                            input: {
                                root: {
                                    className: sectionMemberSelectCardClasses.control,
                                    sx: {
                                        width: { xs: '100%', md: 300 }
                                    }
                                }
                            }
                        },
                        control ?? {}
                    )
                }
                localization={localization}
            />
        </SectionCard>
    );
};
