'use client';

import { CancelButton } from '@components/buttons';
import { Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from '@components/dialog';
import { ItemFormContainer, ItemRoot, ItemRowContainer, RoleSelect, Select } from '@components/items';
import { BrMobile, translatableTypographyStyled } from '@components/text';
import { GuildConfigurationActivityRole, GuildConfigurationActivityRoleType } from '@interfaces/bot';
import { LocalizationProps, TranslationKeys } from '@interfaces/localization';
import { PopoverProps } from '@interfaces/mui';
import { GuildViewProps } from '@interfaces/view';
import { Popover } from '@lunaproject-discord/web-core/dist/components/Popover';
import { ItemDisabledProps, ItemVariableProps } from '@lunaproject-discord/web-core/dist/components/SectionItems';
import {
    AddOutlined,
    DeleteOutlined,
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
import { getInteractRolesByDataGuild } from '@utils/discord';
import { getStateActionValue, UniqueId, updateArrayState } from '@utils/state';
import { nanoid } from 'nanoid';
import React, { Dispatch, Fragment, ReactNode, SetStateAction, useEffect, useMemo, useState } from 'react';

type EditableObject = GuildConfigurationActivityRole & UniqueId;

interface SelectActivityTypeMenuItem {
    type: GuildConfigurationActivityRoleType;
    icon?: ReactNode;
    primary?: ReactNode;
    secondary?: ReactNode;
}

interface SelectActivityTypePopoverProps extends PopoverProps, LocalizationProps {
    selected?: GuildConfigurationActivityRoleType;
    setSelected: Dispatch<SetStateAction<GuildConfigurationActivityRoleType>>;
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

    const handleSelect = (type: GuildConfigurationActivityRoleType) => {
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
            primary: translations.activity_type_custom_status_long,
            secondary: translations.activity_type_custom_status_description
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
    const { locale, translations } = localization;

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    return (
        <Fragment>
            <ItemRoot sx={{ p: 0 }}>
                <ItemRowContainer sx={{ mb: { xs: -1, md: 0 } }}>
                    <RoleSelect
                        value={value.id}
                        setValue={(action) => setValue({ ...value, id: getStateActionValue(action, value.id) })}
                        choices={getInteractRolesByDataGuild(guild)}
                        disabled={disabled}
                        localization={localization}
                        sx={{ width: { xs: '100%', md: 300 } }}
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
                            {translations[`activity_type_${value.type === 'CUSTOM_STATUS' ? 'custom_status' : value.type.toLowerCase()}_short` as TranslationKeys]}
                        </Select>
                        <Tooltip title={translations.remove} placement="top">
                            <IconButton onClick={() => setValue(undefined)} disabled={disabled} color="error">
                                <DeleteOutlined />
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

type ManageRolesDialogProps = DialogProps & ItemVariableProps<GuildConfigurationActivityRole[]> & GuildViewProps;

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
                <DialogContent sx={{ height: { xs: '100%', md: 500 }, gap: { xs: 1, md: 0 } }}>
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

            <SelectActivityTypePopover
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                setSelected={(action) => {
                    const _id = nanoid();
                    updateRole(
                        _id,
                        {
                            _id,
                            enabled: true,
                            id: '',
                            name: '',
                            type: getStateActionValue(action, 'PLAYING')
                        }
                    );
                }}
                localization={localization}
            />
        </Fragment>
    );
};
