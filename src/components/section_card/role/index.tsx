import { RolePickerType } from '@/components/picker';
import { SectionSnowflakeSelectCardProps } from '@/components/section_card';
import { RoleSelect, RoleSelectProps } from '@/components/select';
import {
    generateSectionControlCardClasses,
    SectionCard,
    sectionCardClasses
} from '@lunaproject/web-core/dist/components/SectionCard';
import { useTheme } from '@mui/material';
import clsx from 'clsx';
import deepmerge from 'deepmerge';
import React from 'react';

export const sectionRoleSelectCardClasses = generateSectionControlCardClasses('Role');

export type SectionRoleSelectCardProps = SectionSnowflakeSelectCardProps<RolePickerType, RoleSelectProps>;

export const SectionRoleSelectCard = (
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
    }: SectionRoleSelectCardProps
) => {
    const theme = useTheme();

    return (
        <SectionCard
            disabled={disabled}
            variant={variant}
            className={clsx(sectionRoleSelectCardClasses.root, className)}
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
            <RoleSelect
                value={value}
                setValue={setValue}
                choices={choices}
                multiple={multiple}
                disabled={disabled}
                slotProps={
                    deepmerge<RoleSelectProps['slotProps']>(
                        {
                            input: {
                                root: {
                                    className: sectionRoleSelectCardClasses.control,
                                    sx: {
                                        width: {
                                            xs: '100%',
                                            md: 300
                                        }
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
