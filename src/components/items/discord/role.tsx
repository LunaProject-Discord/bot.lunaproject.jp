'use client';

import { Popover } from '@lunaproject-discord/web-core/dist/components/Popover';
import { ItemProps } from '@lunaproject-discord/web-core/dist/components/SectionItems';
import { Box, ListItemButtonProps, ListItemText, PopoverProps, Theme, Typography, useMediaQuery } from '@mui/material';
import { APIRole } from 'discord-api-types/v10';
import { ellipsis, size } from 'polished';
import React, { Fragment, MouseEvent, useEffect, useState } from 'react';
import { filterPredicateRole, getRoleColor, sortRoles } from '../../../utils/discord';
import {
    ItemFormContainer,
    ItemIcon,
    ItemRoot,
    ItemRowContainer,
    ItemTextBlock,
    SearchBox,
    Select,
    SnowflakeItemProps
} from '../index';
import { List, ListItemButton, ListItemIcon } from './index';

interface ListItemProps extends Omit<ListItemButtonProps, 'role'> {
    role: APIRole;
}

const ListItem = ({ role, ...props }: ListItemProps) => (
    <ListItemButton key={role.id} sx={{ gap: 1 }} {...props}>
        <ListItemIcon sx={{ minWidth: 2 }}>
            <Box sx={{ ...size(16), bgcolor: getRoleColor(role), borderRadius: '50%' }} />
        </ListItemIcon>
        <ListItemText primary={role.name} primaryTypographyProps={{ sx: { ...ellipsis(), display: 'block' } }} />
    </ListItemButton>
);

type Props = SnowflakeItemProps<APIRole>;

interface RolePopoverProps extends PopoverProps, Props {
    anchorEl: PopoverProps['anchorEl'];
    onPopupClose: () => void;
}

export const RolePopover = (
    {
        open,
        anchorEl,
        onPopupClose,
        value,
        setValue,
        choices,
        ...props
    }: RolePopoverProps
) => {
    const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up('md'));

    const [search, setSearch] = useState('');

    const roles = sortRoles(choices) as APIRole[];

    const handlePopupClose = () => {
        setSearch('');
        onPopupClose();
    };

    const handleChange = (role: APIRole) => {
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
                    <ListItem
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

type RoleItemProps = ItemProps & Props;

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
) => {
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const open = Boolean(anchorEl);

    const handlePopoverOpen = (e: MouseEvent<HTMLDivElement>) => setAnchorEl(e.currentTarget);
    const handlePopoverClose = () => setAnchorEl(null);

    const currentRole = choices.find((role) => role.id === value);
    return (
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
                    <Select
                        open={open}
                        onClick={handlePopoverOpen}
                        disabled={disabled}
                        sx={{
                            width: {
                                xs: '100%',
                                md: 300
                            }
                        }}
                    >
                        {currentRole && <Fragment>
                            <Box sx={{ ...size(16), bgcolor: getRoleColor(currentRole), borderRadius: '50%' }} />
                            <Typography variant="body2">{currentRole.name}</Typography>
                        </Fragment>}
                    </Select>
                </ItemFormContainer>
            </ItemRoot>

            <RolePopover
                open={open}
                anchorEl={anchorEl}
                onPopupClose={handlePopoverClose}
                value={value}
                setValue={setValue}
                choices={choices}
            />
        </Fragment>
    );
};
