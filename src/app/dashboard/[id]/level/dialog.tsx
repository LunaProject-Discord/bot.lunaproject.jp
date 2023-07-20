'use client';

import { Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from '@components/dialog';
import { BrMobile, Key } from '@components/text';
import { GuildConfigurationLevelRewardRole } from '@interfaces/bot';
import { GuildRolesViewProps } from '@interfaces/view';
import { NumberField } from '@lunaproject-discord/web-core/dist/components/NumberField';
import { ItemDisabledProps, ItemVariableProps } from '@lunaproject-discord/web-core/dist/components/SectionItems';
import {
    AddOutlined,
    CloseOutlined,
    DeleteOutlined,
    KeyboardArrowDownOutlined,
    KeyboardArrowUpOutlined,
    LabelOffOutlined
} from '@mui/icons-material';
import { Box, Button, IconButton, Theme, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { sortRoles } from '@utils/discord';
import { getStateActionValue, UniqueId } from '@utils/state';
import { nanoid } from 'nanoid';
import React, { Dispatch, Fragment, SetStateAction, useEffect, useMemo, useState } from 'react';
import { ItemFormContainer, ItemRoot, ItemRowContainer, RolePopover, RoleSelect } from '../../../../components/items';

type EditableObject = GuildConfigurationLevelRewardRole & UniqueId;

interface RoleItemProps extends ItemDisabledProps, GuildRolesViewProps {
    value: EditableObject;
    setValue: Dispatch<SetStateAction<EditableObject | undefined>>;
}

const RoleItem = (
    {
        value,
        setValue,
        roles,
        disabled,
        localization
    }: RoleItemProps
) => {
    const { translations } = localization;

    return (
        <ItemRoot sx={{ p: 0 }}>
            <ItemRowContainer>
                <RoleSelect
                    value={value.id}
                    setValue={(action) => setValue({ ...value, id: getStateActionValue(action, value.id) })}
                    choices={roles}
                    localization={localization}
                    sx={{ width: { xs: '100%', md: 300 } }}
                />
            </ItemRowContainer>
            <ItemFormContainer>
                <NumberField
                    value={value.level}
                    setValue={(action) => setValue({ ...value, level: getStateActionValue(action, value.level) })}
                    min={0}
                    disabled={disabled}
                    sx={{ width: { xs: '100%', md: 300 } }}
                />
                <Tooltip title={translations.remove} placement="top">
                    <IconButton onClick={() => setValue(undefined)} color="error">
                        <DeleteOutlined />
                    </IconButton>
                </Tooltip>
            </ItemFormContainer>
        </ItemRoot>
    );
};

type ManageRolesDialogProps =
    DialogProps
    & ItemVariableProps<GuildConfigurationLevelRewardRole[]>
    & GuildRolesViewProps;

export const ManageRolesDialog = (
    {
        open,
        setOpen,
        value,
        setValue,
        roles: choices,
        localization
    }: ManageRolesDialogProps
) => {
    const { translations } = localization;

    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const initialValues = useMemo(() => value.map((role): EditableObject => ({ _id: nanoid(), ...role })), [value]);
    const [roles, setRoles] = useState(initialValues);

    const choiceRoles = sortRoles(choices).filter((role) => role.position !== 0);

    const toRoles = (roles: EditableObject[]) => roles.map(({ _id, ...role }) => role);

    const handleClose = () => {
        setValue(toRoles(roles));
        setOpen(false);
    };

    const updateValue = (id: string, role: EditableObject | undefined) => setRoles((values) => {
        let data = [...values];

        const i = data.findIndex((role) => role._id === id);
        if (i !== -1)
            data.splice(i, 1);

        if (role)
            data.push(role);

        setValue(toRoles(data));
        return data;
    });

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
                            setValue={(action) => updateValue(role._id, getStateActionValue(action, role))}
                            roles={choiceRoles}
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
                    <Button onClick={handleClose} variant="contained" startIcon={<CloseOutlined />}>
                        {translations.close}
                        <Key sx={{ ml: 1, mr: -.5 }}>Esc</Key>
                    </Button>
                </DialogActions>
            </Dialog>

            <RolePopover
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                value=""
                setValue={(action) => {
                    const _id = nanoid();
                    updateValue(_id, { _id, id: getStateActionValue(action, ''), level: 1 });
                }}
                choices={choiceRoles}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                localization={localization}
            />
        </Fragment>
    );
};
