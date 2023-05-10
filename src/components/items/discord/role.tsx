'use client';

import { Popover } from '@lunaproject-discord/web-core/dist/components/Popover';
import { ItemDisabledProps, ItemProps } from '@lunaproject-discord/web-core/dist/components/SectionItems';
import { Box, ListItemButtonProps, ListItemText, Theme, Typography, useMediaQuery } from '@mui/material';
import { APIRole } from 'discord-api-types/v10';
import { ellipsis, size } from 'polished';
import React, { Fragment, useEffect, useState } from 'react';
import { PopoverProps } from '../../../interfaces/mui';
import { RedisRole } from '../../../interfaces/redis';
import { filterPredicateRole, getRoleColor, sortRoles } from '../../../utils/discord';
import {
    ItemFormContainer,
    ItemIcon,
    ItemRoot,
    ItemRowContainer,
    ItemTextBlock,
    SearchBox,
    Select,
    SnowflakeItemProps,
    SnowflakeSelectProps
} from '../index';
import { List, ListItemButton, ListItemIcon } from './index';

type Role = APIRole | RedisRole;

export interface RoleListItemProps extends Omit<ListItemButtonProps, 'role'> {
    role: Role;
}

export const RoleListItem = ({ role, ...props }: RoleListItemProps) => (
    <ListItemButton key={role.id} sx={{ gap: 1 }} {...props}>
        <ListItemIcon sx={{ minWidth: 2 }}>
            <Box sx={{ ...size(16), bgcolor: getRoleColor(role), borderRadius: '50%' }} />
        </ListItemIcon>
        <ListItemText primary={role.name} primaryTypographyProps={{ sx: { ...ellipsis(), display: 'block' } }} />
    </ListItemButton>
);

export type RoleProps = SnowflakeItemProps<Role>;

export type RolePopoverProps = PopoverProps & RoleProps;

export const RolePopover = (
    {
        anchorEl,
        setAnchorEl,
        value,
        setValue,
        choices,
        ...props
    }: RolePopoverProps
) => {
    const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up('md'));

    const open = Boolean(anchorEl);

    const [search, setSearch] = useState('');

    const roles = sortRoles(choices);

    const handlePopupClose = () => {
        setSearch('');
        setAnchorEl(null);
    };

    const handleChange = (role: Role) => {
        setValue(role.id);
        handlePopupClose();
    };

    useEffect(() => {
        if (open && isDesktop)
            setTimeout(() => document.getElementById('popover-search')?.focus());
    }, [open]);

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handlePopupClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{ zIndex: 1600 }}
            PaperProps={{ sx: { width: 300 } }}
            {...props}
        >
            <SearchBox
                id="popover-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="役職を検索..."
            />
            <List>
                {roles.filter((role) => filterPredicateRole(role, search)).map((role) => (
                    <RoleListItem
                        key={role.id}
                        role={role}
                        selected={value === role.id}
                        onClick={() => handleChange(role)}
                    />
                ))}
            </List>
        </Popover>
    );
};

export type RoleSelectProps = ItemDisabledProps & RoleProps & SnowflakeSelectProps<RolePopoverProps>;

export const RoleSelect = ({ value, setValue, choices, disabled, selectSx, popoverProps }: RoleSelectProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const role = choices.find((role) => role.id === value);
    return (
        <Fragment>
            <Select
                open={Boolean(anchorEl)}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                disabled={disabled}
                sx={selectSx}
            >
                {role && <Fragment>
                    <Box sx={{ ...size(16), bgcolor: getRoleColor(role), borderRadius: '50%' }} />
                    <Typography variant="body2">{role.name}</Typography>
                </Fragment>}
            </Select>

            <RolePopover
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                value={value}
                setValue={setValue}
                choices={choices}
                {...popoverProps}
            />
        </Fragment>
    );
};

export type RoleItemProps = ItemProps & RoleProps;

export const RoleItem = (
    {
        icon,
        iconSx,
        primary,
        secondary,
        primaryTypographyProps,
        secondaryTypographyProps,
        value,
        setValue,
        choices,
        disabled,
        sx
    }: RoleItemProps
) => (
    <Fragment>
        <ItemRoot sx={sx}>
            <ItemRowContainer size={secondary ? 'medium' : 'small'}>
                <ItemIcon icon={icon} iconSx={iconSx} />
                <ItemTextBlock
                    primary={primary}
                    secondary={secondary}
                    primaryTypographyProps={primaryTypographyProps}
                    secondaryTypographyProps={secondaryTypographyProps}
                    disabled={disabled}
                />
            </ItemRowContainer>
            <ItemFormContainer>
                <RoleSelect
                    value={value}
                    setValue={setValue}
                    choices={choices}
                    disabled={disabled}
                    selectSx={{
                        width: {
                            xs: '100%',
                            md: 300
                        }
                    }}
                />
            </ItemFormContainer>
        </ItemRoot>
    </Fragment>
);
