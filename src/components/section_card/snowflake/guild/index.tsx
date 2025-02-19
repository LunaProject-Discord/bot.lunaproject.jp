'use client';

import { GuildPickerType } from '@/components/picker';
import { SectionSnowflakeSelectCardProps } from '@/components/section_card';
import { GuildSelect, GuildSelectProps } from '@/components/select';
import {
    generateSectionControlCardClasses,
    SectionCard,
    sectionCardClasses
} from '@lunaproject/web-core/dist/components/SectionCard';
import { useTheme } from '@mui/material';
import clsx from 'clsx';
import deepmerge from 'lodash/merge';
import React from 'react';

export const sectionGuildSelectCardClasses = generateSectionControlCardClasses('GuildSelect');

export type SectionGuildSelectCardProps = SectionSnowflakeSelectCardProps<GuildPickerType, GuildSelectProps>;

export const SectionGuildSelectCard = (
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
    }: SectionGuildSelectCardProps
) => {
    const theme = useTheme();

    return (
        <SectionCard
            disabled={disabled}
            variant={variant}
            className={clsx(sectionGuildSelectCardClasses.root, className)}
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
            <GuildSelect
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
                                    className: sectionGuildSelectCardClasses.control,
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
