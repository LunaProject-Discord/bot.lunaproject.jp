'use client';

import { KeyboardArrowDownIcon } from '@/components/icons';
import { LocalizationProps, TranslationKeys } from '@/interfaces/localization';
import {
    ADVANCED_PERMISSIONS,
    EVENTS_PERMISSIONS,
    GENERAL_PERMISSIONS,
    MEMBERSHIP_PERMISSIONS,
    STAGE_PERMISSIONS,
    TEXT_PERMISSIONS,
    THREAD_PERMISSIONS,
    VOICE_PERMISSIONS
} from '@/interfaces/permissions';
import { buttonActionStyled } from '@lunaproject/web-core/dist/components/ButtonBase';
import {
    ItemDisabledProps,
    ItemTextBlock,
    ItemVariableProps,
    SwitchItemProps
} from '@lunaproject/web-core/dist/components/SectionItems';
import {
    Accordion as MuiAccordion,
    accordionClasses,
    AccordionDetails as MuiAccordionDetails,
    AccordionProps,
    AccordionSummary as MuiAccordionSummary,
    accordionSummaryClasses,
    AccordionSummaryProps,
    Checkbox,
    FormControlLabel,
    FormGroup,
    styled,
    Unstable_Grid2 as Grid
} from '@mui/material';
import deepEqual from 'deep-equal';
import React, { memo, ReactNode, useCallback } from 'react';

const getPermissions = (map: Map<bigint, boolean>) => (permissions: bigint[]) => Array.from(map).filter(([key]) => permissions.includes(key));

const Accordion = styled(
    ({ children, ...props }: AccordionProps) => <MuiAccordion disableGutters elevation={0} {...props}>
        {children}
    </MuiAccordion>
)<AccordionProps>({
    padding: 0,
    backgroundColor: 'unset',
    border: 'none',
    [`&.${accordionClasses.disabled}`]: {
        backgroundColor: 'inherit'
    },
    '&::before': {
        display: 'none'
    }
});

const AccordionSummary = styled(
    (props: AccordionSummaryProps) => <MuiAccordionSummary expandIcon={<KeyboardArrowDownIcon />} {...props} />
)<AccordionSummaryProps>(({ theme }) => ({
    minHeight: 50,
    padding: theme.spacing(0, 1.5),
    gap: theme.spacing(.5),
    fontWeight: 600,
    borderRadius: theme.shape.borderRadius,
    [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
        transform: 'rotate(180deg)'
    },
    [`& .${accordionSummaryClasses.content}`]: {
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1.5)
    },
    ...buttonActionStyled(theme)
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(0, 1.5),
    display: 'flex',
    flexDirection: 'column'
}));

export interface PermissionGroupProps extends ItemDisabledProps, LocalizationProps {
    label: ReactNode;
    permissions: [bigint, boolean][];
    setPermission: (permission: bigint, checked: boolean) => void;
    setPermissions: (permissions: bigint[], checked: boolean) => void;
}

const PermissionGroup = memo<PermissionGroupProps>((
    {
        label,
        permissions,
        setPermission,
        setPermissions,
        disabled,
        localization
    }
) => (
    <FormGroup>
        <FormControlLabel
            control={
                <Checkbox
                    checked={permissions.every(([, enabled]) => enabled)}
                    indeterminate={permissions.some(([, enabled]) => enabled) && permissions.some(([, enabled]) => !enabled)}
                    onChange={(_, checked) => setPermissions(permissions.map(([permission]) => permission), checked)}
                    disabled={disabled}
                />
            }
            label={label}
        />
        <FormGroup sx={{ ml: 3 }}>
            {permissions.map(([permission, enabled]) => (
                <PermissionItem
                    key={permission.toString()}
                    permission={permission}
                    checked={enabled}
                    setChecked={(checked) => setPermission(permission, checked)}
                    disabled={disabled}
                    localization={localization}
                />
            ))}
        </FormGroup>
    </FormGroup>
), (
    { permissions: oldPermissions, disabled: oldDisabled },
    { permissions: newPermissions, disabled: newDisabled }
) => deepEqual(oldPermissions, newPermissions, { strict: true }) && oldDisabled === newDisabled);
PermissionGroup.displayName = 'PermissionGroup';

export interface PermissionItemProps extends SwitchItemProps, ItemDisabledProps, LocalizationProps {
    permission: bigint;
}

export const PermissionItem = (
    {
        permission,
        checked,
        setChecked,
        defaultChecked,
        disabled,
        localization: { translations }
    }: PermissionItemProps
) => (
    <FormControlLabel
        control={
            <Checkbox
                checked={checked}
                onChange={() => setChecked(!checked)}
                defaultChecked={defaultChecked}
                disabled={disabled}
            />
        }
        label={translations[`permission_${permission}` as TranslationKeys]}
    />
);

export interface PermissionsItemProps extends ItemVariableProps<Map<bigint, boolean>>, ItemDisabledProps, LocalizationProps {

}

const PermissionsItem = memo<PermissionsItemProps>(({ value, setValue, disabled, localization }) => {
    const { translations } = localization;

    const permissions = getPermissions(value);

    const setPermission = useCallback((permission: bigint, enabled: boolean) => setValue((prevValue) => {
        const newValue = new Map(prevValue);
        newValue.set(permission, enabled);
        return newValue;
    }), [setValue]);

    const setPermissions = useCallback((permissions: bigint[], enabled: boolean) => setValue((prevValue) => {
        const newValue = new Map(prevValue);
        permissions.forEach((permission) => newValue.set(permission, enabled));
        return newValue;
    }), [setValue]);

    return (
        <Accordion>
            <AccordionSummary>
                <ItemTextBlock primary={translations.role_permissions_select_roles} disabled={disabled} />
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2} sx={{ py: 3 }}>
                    <Grid xs={12} sm={6} xl={4}>
                        <PermissionGroup
                            label={translations.permissions_advanced}
                            permissions={permissions(ADVANCED_PERMISSIONS)}
                            setPermission={setPermission}
                            setPermissions={setPermissions}
                            disabled={disabled}
                            localization={localization}
                        />
                        <PermissionGroup
                            label={translations.permissions_general}
                            permissions={permissions(GENERAL_PERMISSIONS)}
                            setPermission={setPermission}
                            setPermissions={setPermissions}
                            disabled={disabled}
                            localization={localization}
                        />
                    </Grid>
                    <Grid xs={12} sm={6} xl={3}>
                        <PermissionGroup
                            label={translations.permissions_membership}
                            permissions={permissions(MEMBERSHIP_PERMISSIONS)}
                            setPermission={setPermission}
                            setPermissions={setPermissions}
                            disabled={disabled}
                            localization={localization}
                        />
                        <PermissionGroup
                            label={translations.permissions_events}
                            permissions={permissions(EVENTS_PERMISSIONS)}
                            setPermission={setPermission}
                            setPermissions={setPermissions}
                            disabled={disabled}
                            localization={localization}
                        />
                    </Grid>
                    <Grid xs={12} sm={6} xl={5}>
                        <PermissionGroup
                            label={translations.permissions_text}
                            permissions={permissions(TEXT_PERMISSIONS)}
                            setPermission={setPermission}
                            setPermissions={setPermissions}
                            disabled={disabled}
                            localization={localization}
                        />
                    </Grid>
                    <Grid xs={12} sm={6} xl={4}>
                        <PermissionGroup
                            label={translations.permissions_thread}
                            permissions={permissions(THREAD_PERMISSIONS)}
                            setPermission={setPermission}
                            setPermissions={setPermissions}
                            disabled={disabled}
                            localization={localization}
                        />
                    </Grid>
                    <Grid xs={12} sm={6} xl={4}>
                        <PermissionGroup
                            label={translations.permissions_voice}
                            permissions={permissions(VOICE_PERMISSIONS)}
                            setPermission={setPermission}
                            setPermissions={setPermissions}
                            disabled={disabled}
                            localization={localization}
                        />
                    </Grid>
                    <Grid xs={12} sm={6} xl={4}>
                        <PermissionGroup
                            label={translations.permissions_stage}
                            permissions={permissions(STAGE_PERMISSIONS)}
                            setPermission={setPermission}
                            setPermissions={setPermissions}
                            disabled={disabled}
                            localization={localization}
                        />
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
}, (
    { value: oldValue, disabled: oldDisabled },
    { value: newValue, disabled: newDisabled }
) => deepEqual(oldValue, newValue, { strict: true }) && oldDisabled === newDisabled);
PermissionsItem.displayName = 'PermissionsItem';

export { PermissionGroup, PermissionsItem };
