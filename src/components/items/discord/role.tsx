import { Popover } from '@lunaproject-discord/web-core';
import { Box, ListItemButtonProps, ListItemText, PopoverProps, Typography } from '@mui/material';
import { APIRole } from 'discord-api-types/v10';
import { ellipsis, size } from 'polished';
import React, { Fragment, MouseEvent, useState } from 'react';
import { filterPredicateRole, sortRoles } from '../../../utils/discord';
import {
    ItemContainer,
    ItemDisabledProps,
    ItemFormContainer,
    ItemIcon,
    ItemIconProps,
    ItemRowContainer,
    ItemTextBlock,
    ItemTextBlockProps,
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
            <Box
                sx={{
                    ...size(16),
                    bgcolor: `#${role.color.toString(16).padStart(6, '0')}`,
                    borderRadius: '50%'
                }}
            />
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

type RoleItemProps = ItemTextBlockProps & ItemIconProps & ItemDisabledProps & Props;

export const RoleItem = ({ icon, primary, secondary, value, setValue, choices, disabled }: RoleItemProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const open = Boolean(anchorEl);

    const handlePopoverOpen = (e: MouseEvent<HTMLDivElement>) => setAnchorEl(e.currentTarget);
    const handlePopoverClose = () => setAnchorEl(null);

    const currentRole = choices.find((role) => role.id === value);
    return (
        <Fragment>
            <ItemContainer>
                <ItemRowContainer>
                    <ItemIcon icon={icon} />
                    <ItemTextBlock primary={primary} secondary={secondary} disabled={disabled} />
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
                            <Box
                                sx={{
                                    ...size(16),
                                    bgcolor: `#${currentRole.color.toString(16).padStart(6, '0')}`,
                                    borderRadius: '50%'
                                }}
                            />
                            <Typography variant="body2">{currentRole.name}</Typography>
                        </Fragment>}
                    </Select>
                </ItemFormContainer>
            </ItemContainer>

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
