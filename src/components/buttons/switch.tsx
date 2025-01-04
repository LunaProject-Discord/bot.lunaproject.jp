'use client';

import { LocalizationProps } from '@/interfaces/localization';
import { ButtonBase } from '@lunaproject/web-core/dist/components/ButtonBase';
import {
    SectionCardDisabledProps,
    SectionSwitchCardRootProps
} from '@lunaproject/web-core/dist/components/SectionCard';
import { Switch, switchClasses, Typography } from '@mui/material';
import React from 'react';

export type SwitchButtonProps = SectionCardDisabledProps & SectionSwitchCardRootProps & LocalizationProps;

export const SwitchButton = (
    {
        checked,
        setChecked,
        defaultChecked,
        disabled,
        localization: { translations }
    }: SwitchButtonProps
) => {
    const handleToggle = () => setChecked((prevState) => !prevState);

    return (
        <ButtonBase onClick={handleToggle} disabled={disabled} sx={{ pl: 1, flexShrink: 0 }}>
            <Typography variant="body2" color={checked ? 'primary.main' : 'text.secondary'}>
                {checked ? translations.enabled : translations.disabled}
            </Typography>
            <Switch
                checked={checked}
                onChange={handleToggle}
                defaultChecked={defaultChecked}
                disabled={disabled}
                disableRipple
                tabIndex={-1}
                sx={{ [`& .${switchClasses.switchBase}`]: { backgroundColor: 'transparent !important' } }}
            />
        </ButtonBase>
    );
};
