import { EditablePermissionOverride } from '@app/dashboard/[id]/commands/interfaces';
import { CheckIcon, CloseIcon, CommandIcon, DeleteIcon } from '@components/icons';
import { ItemRoot, ItemRowContainer } from '@components/items';
import { LocalizationProps } from '@interfaces/localization';
import { StyledProps } from '@interfaces/mui';
import {
    ItemDisabledProps,
    ItemFormContainer,
    ItemVariableProps
} from '@lunaproject/web-core/dist/components/SectionItems';
import { IconButton, ToggleButton, toggleButtonClasses, ToggleButtonGroup, Tooltip } from '@mui/material';
import { getStateActionValue } from '@utils/react/state';
import React, { Dispatch, ReactNode, SetStateAction } from 'react';

type DefaultEditableValue = 'allow' | 'deny' | 'inherit';

export type DefaultEditableSwitchProps = ItemVariableProps<boolean | null> & ItemDisabledProps;

export const DefaultEditableSwitch = ({ value, setValue, disabled }: DefaultEditableSwitchProps) => (
    <ToggleButtonGroup
        value={value !== null ? (value ? 'allow' : 'deny') : 'inherit'}
        onChange={(_, override: DefaultEditableValue | null) => {
            if (override)
                setValue(override !== 'inherit' ? override === 'allow' : null);
        }}
        disabled={disabled}
        exclusive
        size="small"
    >
        <ToggleButton
            value="deny"
            sx={{
                px: 1.375,
                py: .375,
                color: 'error.main',
                [`&.${toggleButtonClasses.selected}, &.${toggleButtonClasses.selected}:hover`]: {
                    color: 'common.white',
                    bgcolor: 'error.main'
                }
            }}
        >
            <CloseIcon />
        </ToggleButton>
        <ToggleButton
            value="inherit"
            sx={{
                px: 1.375,
                py: .375,
                color: 'action.active',
                [`&.${toggleButtonClasses.selected}, &.${toggleButtonClasses.selected}:hover`]: {
                    color: 'common.white',
                    bgcolor: (theme) => theme.palette.mode === 'light' ? theme.palette.action.active : theme.palette.grey[700]
                }
            }}
        >
            <CommandIcon sx={{ width: 20, height: 20 }} />
        </ToggleButton>
        <ToggleButton
            value="allow"
            sx={{
                px: 1.375,
                py: .375,
                color: 'success.main',
                [`&.${toggleButtonClasses.selected}, &.${toggleButtonClasses.selected}:hover`]: {
                    color: 'common.white',
                    bgcolor: 'success.main'
                }
            }}
        >
            <CheckIcon />
        </ToggleButton>
    </ToggleButtonGroup>
);

export type EditableSwitchProps = ItemVariableProps<boolean> & ItemDisabledProps;

export const EditableSwitch = ({ value, setValue, disabled }: EditableSwitchProps) => (
    <ToggleButtonGroup
        value={value ? 'allow' : 'deny'}
        onChange={(_, override: 'allow' | 'deny' | null) => {
            if (override)
                setValue(override === 'allow');
        }}
        disabled={disabled}
        exclusive
        size="small"
    >
        <ToggleButton
            value="deny"
            sx={{
                px: 1.375,
                py: .375,
                color: 'error.main',
                [`&.${toggleButtonClasses.selected}, &.${toggleButtonClasses.selected}:hover`]: {
                    color: 'common.white',
                    bgcolor: 'error.main'
                }
            }}
        >
            <CloseIcon />
        </ToggleButton>
        <ToggleButton
            value="allow"
            sx={{
                px: 1.375,
                py: .375,
                color: 'success.main',
                [`&.${toggleButtonClasses.selected}, &.${toggleButtonClasses.selected}:hover`]: {
                    color: 'common.white',
                    bgcolor: 'success.main'
                }
            }}
        >
            <CheckIcon />
        </ToggleButton>
    </ToggleButtonGroup>
);

export interface DefaultEditableItemProps extends DefaultEditableSwitchProps, StyledProps {
    children: ReactNode;
}

export const DefaultEditableItem = ({ value, setValue, disabled, sx, children }: DefaultEditableItemProps) => (
    <ItemRoot sx={sx ?? { flexDirection: 'row !important', alignItems: 'center !important' }}>
        <ItemRowContainer sx={{ overflow: 'hidden' }}>
            {children}
        </ItemRowContainer>
        <ItemFormContainer sx={{ width: 'unset !important' }}>
            <DefaultEditableSwitch value={value} setValue={setValue} disabled={disabled} />
        </ItemFormContainer>
    </ItemRoot>
);

export interface EditableItemProps extends ItemDisabledProps, LocalizationProps, StyledProps {
    value: EditablePermissionOverride;
    setValue: Dispatch<SetStateAction<EditablePermissionOverride | undefined>>;
    children: ReactNode;
}

export const EditableItem = (
    {
        value,
        setValue,
        disabled,
        localization: { translations },
        sx,
        children
    }: EditableItemProps
) => (
    <ItemRoot sx={sx ?? { flexDirection: 'row !important', alignItems: 'center !important' }}>
        <ItemRowContainer sx={{ overflow: 'hidden' }}>
            {children}
        </ItemRowContainer>
        <ItemFormContainer sx={{ width: 'unset !important' }}>
            <EditableSwitch
                value={value.override}
                setValue={(action) => setValue({ ...value, override: getStateActionValue(action, value.override) })}
                disabled={disabled}
            />
            <Tooltip title={translations.remove}>
                <IconButton onClick={() => setValue(undefined)} color="error">
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
        </ItemFormContainer>
    </ItemRoot>
);

export type GroupProps = ItemVariableProps<EditablePermissionOverride[]> & LocalizationProps;

export interface OverrideGroupProps extends LocalizationProps {
    default: boolean | null;
    setDefault: Dispatch<SetStateAction<boolean | null>>;
    overrides: EditablePermissionOverride[];
    setOverrides: Dispatch<SetStateAction<EditablePermissionOverride[]>>;
}

export * from './channels';
export * from './roles';
export * from './members';
