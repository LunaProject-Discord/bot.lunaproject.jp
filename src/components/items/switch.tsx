import { Checkbox, Switch, switchClasses } from '@mui/material';
import React from 'react';
import {
    ItemButtonBase,
    ItemDisabledProps,
    ItemFormContainer,
    ItemIcon,
    ItemIconProps,
    ItemRowContainer,
    ItemTextBlock,
    ItemTextBlockProps
} from './index';

interface Props extends ItemTextBlockProps, ItemIconProps, ItemDisabledProps {
    checked: boolean;
    setChecked: (checked: boolean) => void;
    defaultChecked?: boolean;
}

export const SwitchItem = (
    {
        icon,
        primary,
        secondary,
        checked,
        setChecked,
        defaultChecked,
        disabled
    }: Props
) => (
    <ItemButtonBase onClick={() => setChecked(!checked)} disabled={disabled}>
        <ItemRowContainer>
            <ItemIcon icon={icon} />
            <ItemTextBlock primary={primary} secondary={secondary} disabled={disabled} />
            <ItemFormContainer sx={{ mr: -.75 }}>
                <Switch
                    checked={checked}
                    onChange={() => setChecked(!checked)}
                    defaultChecked={defaultChecked}
                    disabled={disabled}
                    disableRipple
                    tabIndex={-1}
                    sx={{ [`& .${switchClasses.switchBase}`]: { backgroundColor: 'transparent !important' } }}
                />
            </ItemFormContainer>
        </ItemRowContainer>
    </ItemButtonBase>
);

export const CheckItem = (
    {
        icon,
        primary,
        secondary,
        checked,
        setChecked,
        defaultChecked,
        disabled
    }: Props
) => (
    <ItemButtonBase onClick={() => setChecked(!checked)} disabled={disabled}>
        <ItemRowContainer>
            <Checkbox
                checked={checked}
                onChange={() => setChecked(!checked)}
                defaultChecked={defaultChecked}
                disabled={disabled}
                disableRipple
                tabIndex={-1}
                sx={{ width: 48, height: 48 }}
            />
            <ItemIcon icon={icon} />
            <ItemTextBlock primary={primary} secondary={secondary} disabled={disabled} />
        </ItemRowContainer>
    </ItemButtonBase>
);
