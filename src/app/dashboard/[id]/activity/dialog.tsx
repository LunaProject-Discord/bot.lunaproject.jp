'use client';

import { CancelButton } from '@/components/buttons';
import { ErrorDescription, ErrorRoot, ErrorTitle } from '@/components/error';
import {
    AddIcon,
    DeleteIcon,
    LabelOffIcon,
    LiveTvIcon,
    MusicNoteIcon,
    SportsEsportsIcon,
    TagIcon,
    VideocamIcon
} from '@/components/icons';
import { RoleSelect } from '@/components/select';
import { translatableTypographyStyled } from '@/components/text';
import { GuildConfigurationActivityRole, GuildConfigurationActivityRoleType } from '@/interfaces/bot';
import { LocalizationProps, TranslationKeys } from '@/interfaces/localization';
import { PopoverProps } from '@/interfaces/mui';
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
import { Popover } from '@lunaproject/web-core/dist/components/Popover';
import {
    SectionCardContent,
    SectionCardDisabledProps,
    SectionCardDisplayRoot,
    SectionCardRoot,
    SectionCardVariableProps
} from '@lunaproject/web-core/dist/components/SectionCard';
import { SelectOutlinedInput } from '@lunaproject/web-core/dist/components/Select';
import { getStateActionValue, UniqueId, updateArrayState } from '@lunaproject/web-core/dist/utils';
import {
    Box,
    IconButton,
    ListItemIcon,
    ListItemText,
    listItemTextClasses,
    MenuItem,
    menuItemClasses,
    MenuList,
    OutlinedInput,
    Tooltip,
    Typography,
    useMediaQuery
} from '@mui/material';
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
            icon: <SportsEsportsIcon />,
            primary: translations.activity_type_playing_long,
            secondary: translations.activity_type_playing_description
        },
        {
            type: 'STREAMING',
            icon: <VideocamIcon />,
            primary: translations.activity_type_streaming_long,
            secondary: translations.activity_type_streaming_description
        },
        {
            type: 'LISTENING',
            icon: <MusicNoteIcon />,
            primary: translations.activity_type_listening_long,
            secondary: translations.activity_type_listening_description
        },
        {
            type: 'WATCHING',
            icon: <LiveTvIcon />,
            primary: translations.activity_type_watching_long,
            secondary: translations.activity_type_watching_description
        },
        {
            type: 'CUSTOM_STATUS',
            icon: <TagIcon />,
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
    const { locale, translations } = localization;

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    return (
        <Fragment>
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
                <SectionCardContent sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
                    <OutlinedInput
                        value={value.name}
                        onChange={(e) => setValue({ ...value, name: e.target.value })}
                        type="text"
                        disabled={disabled || !value.enabled}
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
                        <SelectOutlinedInput
                            open={Boolean(anchorEl)}
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            disabled={disabled || !value.enabled}
                        >
                            <Typography>
                                {translations[`activity_type_${value.type === 'CUSTOM_STATUS' ? 'custom_status' : value.type.toLowerCase()}_short` as TranslationKeys]}
                            </Typography>
                        </SelectOutlinedInput>
                        <Tooltip title={translations.remove}>
                            <IconButton onClick={() => setValue(undefined)} disabled={disabled} color="error">
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </SectionCardContent>
            </SectionCardRoot>

            <SelectActivityTypePopover
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                selected={value.type}
                setSelected={(action) => setValue({
                    ...value,
                    type: getStateActionValue(action, value.type)
                })}
                localization={localization}
            />
        </Fragment>
    );
};

type ManageRolesDialogProps =
    ModalProps
    & SectionCardVariableProps<{ value: GuildConfigurationActivityRole[]; }>
    & GuildViewProps;

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

    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

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
                    {translations.activity_manage_roles}
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
                <DialogContent sx={{ height: { xs: '100%', md: 500 }, gap: { xs: 1, md: 0 } }}>
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
                        <ErrorTitle>
                            {translations.dashboard_error_manage_roles_empty_dialog_title}
                        </ErrorTitle>
                        <ErrorDescription>
                            {translations.dashboard_error_manage_roles_empty_dialog_description}
                        </ErrorDescription>
                    </ErrorRoot>}
                </DialogContent>
                <DialogActions>
                    <CancelButton onClick={handleClose} variant="outlined" corners="extended">
                        {translations.close}
                    </CancelButton>
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
