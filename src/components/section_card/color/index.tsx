'use client';

import { ColorField, ColorFieldProps } from '@/components/field';
import { SectionControlCardSlotProps } from '@/components/section_card';
import { LocalizationProps } from '@/interfaces/localization';
import {
    generateSectionControlCardClasses,
    SectionCard,
    sectionCardClasses,
    SectionCardDisabledProps,
    SectionCardProps,
    SectionCardVariableProps
} from '@lunaproject/web-core/dist/components/SectionCard';
import { useTheme } from '@mui/material';
import { HsvaColor } from '@uiw/react-color';
import clsx from 'clsx';
import deepmerge from 'deepmerge';
import React from 'react';

export const sectionColorFieldCardClasses = generateSectionControlCardClasses('ColorField');

export interface SectionColorFieldCardRootProps extends SectionCardVariableProps<{
    value: HsvaColor;
}>, SectionCardDisabledProps, LocalizationProps {
    choices?: string[];
    disableAlpha?: boolean;
}

export type SectionColorFieldCardProps =
    SectionCardProps
    & SectionControlCardSlotProps<ColorFieldProps>
    & SectionColorFieldCardRootProps;

export const SectionColorFieldCard = (
    {
        children,
        value,
        setValue,
        choices,
        disabled,
        disableAlpha,
        variant,
        className,
        sx,
        slots,
        slotProps: {
            control: controlProps,
            ...slotProps
        } = {},
        localization,
        ...props
    }: SectionColorFieldCardProps
) => {
    const theme = useTheme();

    return (
        <SectionCard
            disabled={disabled}
            variant={variant}
            className={clsx(sectionColorFieldCardClasses.root, className)}
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
            <ColorField
                value={value}
                setValue={setValue}
                choices={choices}
                disabled={disabled}
                disableAlpha={disableAlpha}
                slotProps={
                    deepmerge<ColorFieldProps['slotProps']>(
                        {
                            input: {
                                className: sectionColorFieldCardClasses.control,
                                sx: {
                                    width: { xs: '100%', md: 300 }
                                }
                            }
                        },
                        controlProps ?? {}
                    )
                }
                localization={localization}
            />
        </SectionCard>
    );
};
