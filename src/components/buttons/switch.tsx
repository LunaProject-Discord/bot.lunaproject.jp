import { LocalizationProps } from '@/interfaces/localization';
import { ButtonBase } from '@lunaproject/web-core/dist/components/ButtonBase';
import { ItemDisabledProps } from '@lunaproject/web-core/dist/components/SectionItems';
import { Switch, switchClasses, Typography } from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';

export interface SwitchButtonProps extends ItemDisabledProps, LocalizationProps {
    checked: boolean;
    setChecked: Dispatch<SetStateAction<boolean>>;
    defaultChecked?: boolean;
}

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
