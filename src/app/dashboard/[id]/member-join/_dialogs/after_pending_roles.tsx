'use client';

import { CancelButton, SwitchButton } from '@/components/buttons';
import { ErrorDescription, ErrorRoot, ErrorTitle } from '@/components/error';
import { AddIcon, DeleteIcon, LabelOffIcon } from '@/components/icons';
import { RolePicker, RolePickerType } from '@/components/picker';
import { RoleSelect } from '@/components/select';
import { GuildConfigurationMemberJoinAfterPendingRole } from '@/interfaces/bot';
import { GuildViewProps } from '@/interfaces/view';
import { getInteractRolesByDataGuild } from '@/utils/discord';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    ModalProps
} from '@lunaproject/web-core/dist/components/Dialog';
import { PickerChoiceClickHandler } from '@lunaproject/web-core/dist/components/Picker';
import {
    SectionCardContent,
    SectionCardDisabledProps,
    SectionCardDisplayRoot,
    SectionCardRoot,
    SectionCardVariableProps
} from '@lunaproject/web-core/dist/components/SectionCard';
import { getStateActionValue, UniqueId, updateArrayState } from '@lunaproject/web-core/dist/utils';
import { Box, Divider, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { nanoid } from 'nanoid';
import React, { Dispatch, Fragment, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';

type EditableObject = GuildConfigurationMemberJoinAfterPendingRole & UniqueId;

interface RoleItemProps extends SectionCardDisabledProps, GuildViewProps {
    value: EditableObject;
    setValue: Dispatch<SetStateAction<EditableObject | undefined>>;
}

const RoleItem = (
    {
        value,
        setValue,
        disabled,
        guild,
        localization
    }: RoleItemProps
) => {
    const { translations } = localization;

    return (
        <SectionCardRoot sx={{ minHeight: 0, p: 0 }}>
            <SectionCardDisplayRoot sx={{ width: { xs: '100%', md: 'auto' } }}>
                <RoleSelect
                    value={value.id}
                    setValue={(action) => setValue({
                        ...value,
                        id: getStateActionValue(action, value.id)
                    })}
                    choices={getInteractRolesByDataGuild(guild)}
                    disabled={disabled || !value.enabled}
                    slotProps={{
                        input: {
                            root: {
                                sx: {
                                    width: { xs: '100%', md: 300 }
                                }
                            }
                        }
                    }}
                    localization={localization}
                />
            </SectionCardDisplayRoot>
            <SectionCardContent>
                <SwitchButton
                    checked={value.enabled}
                    setChecked={(action) => setValue({
                        ...value,
                        enabled: getStateActionValue(action, value.enabled)
                    })}
                    disabled={disabled}
                    localization={localization}
                />
                <Divider orientation="vertical" flexItem sx={{ my: 1.5 }} />
                <Tooltip title={translations.remove}>
                    <IconButton onClick={() => setValue(undefined)} disabled={disabled} color="error">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </SectionCardContent>
        </SectionCardRoot>
    );
};

type ManageAfterPendingRolesDialogProps =
    ModalProps
    & SectionCardVariableProps<{ value: GuildConfigurationMemberJoinAfterPendingRole[]; }>
    & GuildViewProps;

export const ManageAfterPendingRolesDialog = (
    {
        open,
        setOpen,
        value,
        setValue,
        guild,
        localization
    }: ManageAfterPendingRolesDialogProps
) => {
    const { translations } = localization;

    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined);

    const initialValues = useMemo(() => value.map((role): EditableObject => ({ _id: nanoid(), ...role })), [value]);
    const [roles, setRoles] = useState(initialValues);
    const updateRole = updateArrayState(setRoles, setValue);

    const toRoles = (roles: EditableObject[]) => roles.map(({ _id, ...role }) => role);

    const handleClose = () => {
        setValue(toRoles(roles));
        setOpen(false);
    };

    const handleChoiceClick: PickerChoiceClickHandler<RolePickerType> = useCallback((_, role) => {
        const _id = nanoid();
        updateRole(_id, { _id, enabled: true, id: role.id });
        setAnchorEl(undefined);
    }, [updateRole]);

    useEffect(() => {
        if (!open)
            setRoles(initialValues);
    }, [initialValues, open, value]);

    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen={isMobile}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
                    {translations.member_join_manage_roles}
                    <Button
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        disableElevation
                        variant="contained"
                        corners="extended"
                        startIcon={<AddIcon />}
                        sx={{ ml: 'auto' }}
                    >
                        {translations.add}
                    </Button>
                </DialogTitle>
                <DialogContent sx={{ height: { xs: '100%', md: 500 } }}>
                    {roles.length > 0 ? <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {roles.map((role) => (
                            <RoleItem
                                key={role._id}
                                value={role}
                                setValue={(action) => updateRole(
                                    role._id,
                                    getStateActionValue(action, role)
                                )}
                                guild={guild}
                                localization={localization}
                            />
                        ))}
                    </Box> : <ErrorRoot>
                        <LabelOffIcon sx={{ fontSize: '10rem' }} />
                        <ErrorTitle>{translations.dashboard_error_manage_roles_empty_dialog_title}</ErrorTitle>
                        <ErrorDescription>{translations.dashboard_error_manage_roles_empty_dialog_description}</ErrorDescription>
                    </ErrorRoot>}
                </DialogContent>
                <DialogActions>
                    <CancelButton onClick={handleClose} variant="outlined" corners="extended">
                        {translations.close}
                    </CancelButton>
                </DialogActions>
            </Dialog>

            <RolePicker
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                choices={getInteractRolesByDataGuild(guild)}
                onClick={handleChoiceClick}
                slotProps={{
                    desktop: {
                        root: {
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'right'
                            },
                            transformOrigin: {
                                vertical: 'top',
                                horizontal: 'right'
                            }
                        }
                    }
                }}
                localization={localization}
            />
        </Fragment>
    );
};
