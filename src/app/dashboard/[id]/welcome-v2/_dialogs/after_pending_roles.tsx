'use client';

import { CancelButton, SwitchButton } from '@components/buttons';
import { Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from '@components/dialog';
import { ItemFormContainer, ItemRoot, ItemRowContainer, RolePopover } from '@components/items';
import { BrMobile } from '@components/text';
import { GuildConfigurationWelcomeV2AfterPendingRole } from '@interfaces/bot';
import { GuildViewProps } from '@interfaces/view';
import { ItemDisabledProps, ItemVariableProps } from '@lunaproject-discord/web-core/dist/components/SectionItems';
import {
    AddOutlined,
    DeleteOutlined,
    KeyboardArrowDownOutlined,
    KeyboardArrowUpOutlined,
    LabelOffOutlined
} from '@mui/icons-material';
import { Box, Button, Divider, IconButton, Theme, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { getInteractRolesByDataGuild, getRoleColor } from '@utils/discord';
import { getStateActionValue, UniqueId, updateArrayState } from '@utils/state';
import { nanoid } from 'nanoid';
import { size } from 'polished';
import React, { Dispatch, Fragment, SetStateAction, useEffect, useMemo, useState } from 'react';

type EditableObject = GuildConfigurationWelcomeV2AfterPendingRole & UniqueId;

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

    const role = guild.roles.find((role) => role.id === value.id);
    return (
        <ItemRoot sx={{ p: 0, flexDirection: 'row !important' }}>
            <ItemRowContainer sx={{ overflow: 'hidden' }}>
                {role && <Fragment>
                    <Box
                        sx={{
                            ...size(16),
                            flexShrink: 0,
                            bgcolor: getRoleColor(role),
                            borderRadius: '50%'
                        }}
                    />
                    <Typography
                        sx={{
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden'
                        }}
                    >
                        {role.name}
                    </Typography>
                </Fragment>}
            </ItemRowContainer>
            <ItemFormContainer sx={{ width: 'unset !important' }}>
                <SwitchButton
                    checked={value.enabled}
                    setChecked={(action) => setValue({ ...value, enabled: getStateActionValue(action, value.enabled) })}
                    disabled={disabled}
                    localization={localization}
                />
                <Divider orientation="vertical" flexItem sx={{ my: 2 }} />
                <Tooltip title={translations.remove} placement="top">
                    <IconButton onClick={() => setValue(undefined)} disabled={disabled} color="error">
                        <DeleteOutlined />
                    </IconButton>
                </Tooltip>
            </ItemFormContainer>
        </ItemRoot>
    );
};

type ManageAfterPendingRolesDialogProps =
    DialogProps
    & ItemVariableProps<GuildConfigurationWelcomeV2AfterPendingRole[]>
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
                    {translations.welcome_message_manage_roles}
                    <Button
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        disableElevation
                        variant="contained"
                        startIcon={<AddOutlined />}
                        endIcon={anchorEl ? <KeyboardArrowUpOutlined /> : <KeyboardArrowDownOutlined />}
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
                    )) : <Box
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            placeItems: 'center',
                            placeContent: 'center',
                            gap: 1
                        }}
                    >
                        <LabelOffOutlined color="primary" sx={{ fontSize: '10rem' }} />
                        <Typography variant="h4" align="center">登録されている<BrMobile />役職がありません</Typography>
                        <Typography align="center">
                            右上のボタンから役職を追加できます。
                        </Typography>
                    </Box>}
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
                            id: getStateActionValue(action, '')
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
