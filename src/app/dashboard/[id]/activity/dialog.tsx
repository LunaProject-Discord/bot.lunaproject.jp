'use client';

import { Dialog, DialogActions } from '@lunaproject-discord/web-core/dist/components/Dialog';
import { Popover } from '@lunaproject-discord/web-core/dist/components/Popover';
import { ItemDisabledProps, ItemVariableProps } from '@lunaproject-discord/web-core/dist/components/SectionItems';
import {
    AddOutlined,
    ClearOutlined,
    CloseOutlined,
    KeyboardArrowDownOutlined,
    KeyboardArrowUpOutlined,
    LabelOffOutlined,
    MusicNoteOutlined,
    OndemandVideoOutlined,
    SportsEsportsOutlined,
    TagOutlined,
    VideocamOutlined
} from '@mui/icons-material';
import {
    Box,
    Button,
    dialogActionsClasses,
    DialogContent,
    DialogTitle,
    IconButton,
    ListItemIcon,
    ListItemText,
    listItemTextClasses,
    MenuItem,
    menuItemClasses,
    MenuList,
    OutlinedInput,
    Theme,
    Tooltip,
    Typography,
    useMediaQuery
} from '@mui/material';
import { nanoid } from 'nanoid';
import React, { Dispatch, Fragment, ReactNode, SetStateAction, useEffect, useMemo, useState } from 'react';
import { DialogProps } from '../../../../components/dialog';
import { ItemFormContainer, ItemRoot, ItemRowContainer, RoleSelect, Select } from '../../../../components/items';
import { BrMobile, Key, translatableTypographyStyled } from '../../../../components/text';
import { GuildSettingsActivityRole, GuildSettingsActivityRoleType } from '../../../../interfaces/bot';
import { LocalizationProps, TranslationKeys } from '../../../../interfaces/localization';
import { PopoverProps } from '../../../../interfaces/mui';
import { RedisRole } from '../../../../interfaces/redis';
import { GuildRolesViewProps } from '../../../../interfaces/view';
import { sortRoles } from '../../../../utils/discord';
import { getStateActionValue, UniqueId } from '../../../../utils/state';

type EditableObject = GuildSettingsActivityRole & UniqueId;

interface SelectActivityTypeMenuItem {
    type: GuildSettingsActivityRoleType;
    icon?: ReactNode;
    primary?: ReactNode;
    secondary?: ReactNode;
}

interface SelectActivityTypePopoverProps extends PopoverProps, LocalizationProps {
    selected?: GuildSettingsActivityRoleType;
    setSelected: Dispatch<SetStateAction<GuildSettingsActivityRoleType>>;
}

const SelectActivityTypePopover = (
    {
        anchorEl,
        setAnchorEl,
        selected,
        setSelected,
        localization: { translations },
        ...props
    }: SelectActivityTypePopoverProps
) => {
    const open = Boolean(anchorEl);

    const handleClose = () => setAnchorEl(null);

    const handleSelect = (type: GuildSettingsActivityRoleType) => {
        setSelected(type);
        handleClose();
    };

    const items: SelectActivityTypeMenuItem[] = [
        {
            type: 'PLAYING',
            icon: <SportsEsportsOutlined />,
            primary: translations.activity_type_playing_long,
            secondary: translations.activity_type_playing_description
        },
        {
            type: 'STREAMING',
            icon: <VideocamOutlined />,
            primary: translations.activity_type_streaming_long,
            secondary: translations.activity_type_streaming_description
        },
        {
            type: 'LISTENING',
            icon: <MusicNoteOutlined />,
            primary: translations.activity_type_listening_long,
            secondary: translations.activity_type_listening_description
        },
        {
            type: 'WATCHING',
            icon: <OndemandVideoOutlined />,
            primary: translations.activity_type_watching_long,
            secondary: translations.activity_type_watching_description
        },
        {
            type: 'CUSTOM_STATUS',
            icon: <TagOutlined />,
            primary: translations.activity_type_custom_long,
            secondary: translations.activity_type_custom_description
        }
    ];

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{ zIndex: 1600 }}
            {...props}
        >
            <MenuList
                sx={(theme) => ({
                    p: 1,
                    [`& .${menuItemClasses.root}`]: {
                        px: 1,
                        alignItems: 'flex-start',
                        borderRadius: 1
                    },
                    [`& .${listItemTextClasses.secondary}`]: {
                        whiteSpace: { xs: 'normal', md: 'nowrap' },
                        ...translatableTypographyStyled(theme)
                    }
                })}
            >
                {items.map(({ type, icon, primary, secondary }) => (
                    <MenuItem key={type} onClick={() => handleSelect(type)} selected={type === selected}>
                        {icon && <ListItemIcon>{icon}</ListItemIcon>}
                        <ListItemText primary={primary} secondary={secondary} />
                    </MenuItem>
                ))}
            </MenuList>
        </Popover>
    );
};

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
    const { locale, translations } = localization;

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    return (
        <Fragment>
            <ItemRoot sx={{ p: 0 }}>
                <ItemRowContainer>
                    <RoleSelect
                        value={value.id}
                        setValue={(action) => setValue({ ...value, id: getStateActionValue(action, value.id) })}
                        choices={roles}
                        selectSx={{ width: { xs: '100%', md: 300 } }}
                    />
                </ItemRowContainer>
                <ItemFormContainer sx={{ height: { xs: 'auto', md: 50 }, flexDirection: { xs: 'column', md: 'row' } }}>
                    <OutlinedInput
                        value={value.name}
                        onChange={(e) => setValue({ ...value, name: e.target.value })}
                        type="text"
                        disabled={disabled}
                        size="small"
                        margin="none"
                        sx={{ width: { xs: '100%', md: 300 } }}
                    />
                    <Box
                        sx={{
                            width: { xs: '100%', md: 'auto' },
                            display: 'flex',
                            flexShrink: 0,
                            placeItems: 'center',
                            placeContent: 'center',
                            gap: 1
                        }}
                    >
                        {locale === 'ja' ? 'を' : 'is'}
                        <Select
                            open={Boolean(anchorEl)}
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            disabled={disabled}
                            sx={{
                                width: {
                                    xs: '100%',
                                    md: 'auto'
                                }
                            }}
                        >
                            {translations[`activity_type_${value.type === 'CUSTOM_STATUS' ? 'custom' : value.type.toLowerCase()}_short` as TranslationKeys]}
                        </Select>
                        <Tooltip title={translations.remove} placement="top">
                            <IconButton onClick={() => setValue(undefined)} color="error">
                                <ClearOutlined />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </ItemFormContainer>
            </ItemRoot>

            <SelectActivityTypePopover
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                selected={value.type}
                setSelected={(action) => setValue({ ...value, type: getStateActionValue(action, value.type) })}
                localization={localization}
            />
        </Fragment>
    );
};

type ManageRolesDialogProps = DialogProps & ItemVariableProps<GuildSettingsActivityRole[]> & GuildRolesViewProps;

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

    const choiceRoles = (sortRoles(choices) as RedisRole[]).filter((role) => role.position !== 0);

    const toRoles = (roles: EditableObject[]) => roles.map(({ _id, ...role }) => role);

    const handleClose = () => {
        setValue(toRoles(roles));
        setOpen(false);
    };

    const updateValue = (id: string, role: EditableObject | undefined) => setRoles((values) => {
        let data = [...values];

        const i = data.findIndex((activityRole) => activityRole._id === id);
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
                sx={{
                    zIndex: (theme) => theme.zIndex.modal + 100,
                    [`& .${dialogActionsClasses.root}`]: {
                        mt: 'auto',
                        p: 2,
                        pt: 0,
                        gap: 1.5
                    }
                }}
            >
                <DialogTitle sx={{ m: 0, p: 2, pb: 0, display: 'flex', alignItems: 'center' }}>
                    {translations.activity_manage_roles}
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
                <DialogContent
                    sx={{
                        p: '0 !important',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{ height: { xs: '100%', md: 500 }, p: 2, overflowY: 'auto' }}>
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
                            <LabelOffOutlined sx={{ fontSize: '10rem' }} color="primary" />
                            <Typography variant="h4" align="center">登録されている<BrMobile />役職がありません</Typography>
                            <Typography align="center">
                                右上のボタンから役職を追加できます。
                            </Typography>
                        </Box>}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" startIcon={<CloseOutlined />}>
                        {translations.close}
                        <Key sx={{ ml: 1, mr: -.5 }}>Esc</Key>
                    </Button>
                </DialogActions>
            </Dialog>

            <SelectActivityTypePopover
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                setSelected={(action) => {
                    const _id = nanoid();
                    updateValue(_id, { _id, id: '', name: '', type: getStateActionValue(action, 'PLAYING') });
                }}
                localization={localization}
            />
        </Fragment>
    );
};
