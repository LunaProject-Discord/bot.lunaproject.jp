'use client';

import { CancelButton, SwitchButton } from '@/components/buttons';
import { ErrorDescription, ErrorRoot, ErrorTitle } from '@/components/error';
import { AddIcon, DeleteIcon, KeyboardArrowDownIcon, KeyboardArrowUpIcon, LabelOffIcon } from '@/components/icons';
import { ItemFormContainer, ItemRoot, ItemRowContainer, RolePopover, RoleSelect } from '@/components/items';
import { GuildConfigurationLevelRewardRole } from '@/interfaces/bot';
import { GuildViewProps } from '@/interfaces/view';
import { getInteractRolesByDataGuild } from '@/utils/discord';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    ModalProps
} from '@lunaproject/web-core/dist/components/Dialog';
import { NumberField } from '@lunaproject/web-core/dist/components/NumberField';
import { ItemDisabledProps, ItemVariableProps } from '@lunaproject/web-core/dist/components/SectionItems';
import { getStateActionValue, UniqueId, updateArrayState } from '@lunaproject/web-core/dist/utils';
import { Button, Divider, IconButton, Theme, Tooltip, useMediaQuery } from '@mui/material';
import { nanoid } from 'nanoid';
import React, { Dispatch, Fragment, SetStateAction, useEffect, useMemo, useState } from 'react';

type EditableObject = GuildConfigurationLevelRewardRole & UniqueId;

interface RoleItemProps extends ItemDisabledProps, GuildViewProps {
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
        <ItemRoot sx={{ p: 0 }}>
            <ItemRowContainer sx={{ mb: { xs: -2, md: 0 } }}>
                <RoleSelect
                    value={value.id}
                    setValue={(action) => setValue({ ...value, id: getStateActionValue(action, value.id) })}
                    choices={getInteractRolesByDataGuild(guild)}
                    disabled={disabled || !value.enabled}
                    localization={localization}
                    sx={{ width: { xs: '100%', md: 300 } }}
                />
            </ItemRowContainer>
            <ItemFormContainer>
                <NumberField
                    value={value.level}
                    setValue={(action) => setValue({ ...value, level: getStateActionValue(action, value.level) })}
                    pattern="\d*"
                    step={1}
                    min={1}
                    disabled={disabled || !value.enabled}
                    sx={{ width: { xs: '100%', md: 300 } }}
                />
                <SwitchButton
                    checked={value.enabled}
                    setChecked={(action) => setValue({ ...value, enabled: getStateActionValue(action, value.enabled) })}
                    disabled={disabled}
                    localization={localization}
                />
                <Divider orientation="vertical" flexItem sx={{ my: 2 }} />
                <Tooltip title={translations.remove}>
                    <IconButton onClick={() => setValue(undefined)} disabled={disabled} color="error">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </ItemFormContainer>
        </ItemRoot>
    );
};

type ManageRolesDialogProps = ModalProps & ItemVariableProps<GuildConfigurationLevelRewardRole[]> & GuildViewProps;

export const ManageRolesDialog = (
    {
        open,
        setOpen,
        value,
        setValue,
        guild,
        localization
    }: ManageRolesDialogProps
) => {
    const { translations } = localization;

    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const initialValues = useMemo(() => value.map((role): EditableObject => ({ _id: nanoid(), ...role })), [value]);
    const [roles, setRoles] = useState(initialValues);
    const updateRole = updateArrayState(setRoles, setValue);

    const toRoles = (roles: EditableObject[]) => roles.map(({ _id, ...role }) => role);

    const handleClose = () => {
        setValue(toRoles(roles));
        setOpen(false);
    };

    useEffect(() => {
        if (!open)
            setRoles(initialValues);
    }, [open, value]);

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
                    {translations.level_reward_manage_roles}
                    <Button
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        disableElevation
                        variant="contained"
                        startIcon={<AddIcon />}
                        endIcon={anchorEl ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        sx={{ ml: 'auto' }}
                    >
                        {translations.add}
                    </Button>
                </DialogTitle>
                <DialogContent sx={{ height: { xs: '100%', md: 500 } }}>
                    {roles.length > 0 ? roles.map((role) => (
                        <RoleItem
                            key={role._id}
                            value={role}
                            setValue={(action) => updateRole(role._id, getStateActionValue(action, role))}
                            guild={guild}
                            localization={localization}
                        />
                    )) : <ErrorRoot>
                        <LabelOffIcon sx={{ fontSize: '10rem' }} />
                        <ErrorTitle>
                            {translations.dashboard_error_manage_roles_empty_dialog_title}
                        </ErrorTitle>
                        <ErrorDescription>
                            {translations.dashboard_error_manage_roles_empty_dialog_description}
                        </ErrorDescription>
                    </ErrorRoot>}
                </DialogContent>
                <DialogActions>
                    <CancelButton onClick={handleClose} variant="contained">{translations.close}</CancelButton>
                </DialogActions>
            </Dialog>

            <RolePopover
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                value=""
                setValue={(action) => {
                    const _id = nanoid();
                    updateRole(
                        _id,
                        {
                            _id,
                            enabled: true,
                            id: getStateActionValue(action, ''),
                            level: 1
                        }
                    );
                }}
                choices={getInteractRolesByDataGuild(guild)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                localization={localization}
            />
        </Fragment>
    );
};
