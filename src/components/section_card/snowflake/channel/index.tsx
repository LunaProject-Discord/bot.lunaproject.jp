'use client';

import { ChannelPickerType } from '@/components/picker';
import { SectionSnowflakeSelectCardProps } from '@/components/section_card';
import { ChannelSelect, ChannelSelectProps } from '@/components/select';
import {
    generateSectionControlCardClasses,
    SectionCard,
    sectionCardClasses
} from '@lunaproject/web-core/dist/components/SectionCard';
import { useTheme } from '@mui/material';
import clsx from 'clsx';
import deepmerge from 'lodash/merge';
import React from 'react';

export const sectionChannelSelectCardClasses = generateSectionControlCardClasses('ChannelSelect');

export type SectionChannelSelectCardProps = SectionSnowflakeSelectCardProps<ChannelPickerType, ChannelSelectProps>;

export const SectionChannelSelectCard = (
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
    }: SectionChannelSelectCardProps
) => {
    const theme = useTheme();

    return (
        <SectionCard
            disabled={disabled}
            variant={variant}
            className={clsx(sectionChannelSelectCardClasses.root, className)}
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
            <ChannelSelect
                value={value}
                setValue={setValue}
                choices={choices}
                multiple={multiple}
                disabled={disabled}
                slotProps={
                    deepmerge(
                        {
                            input: {
                                root: {
                                    className: sectionChannelSelectCardClasses.control,
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
