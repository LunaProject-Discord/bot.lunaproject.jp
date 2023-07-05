'use client';

import { PopoverProps } from '@interfaces/mui';
import { RedisRole } from '@interfaces/redis';
import { Popover } from '@lunaproject-discord/web-core/dist/components/Popover';
import { ItemDisabledProps, ItemProps } from '@lunaproject-discord/web-core/dist/components/SectionItems';
import {
    Box,
    ListItemButtonProps,
    ListItemText,
    popoverClasses,
    Theme,
    Typography,
    useMediaQuery
} from '@mui/material';
import { filterPredicateRole, getRoleColor, sortRoles } from '@utils/discord';
import { APIRole } from 'discord-api-types/v10';
import { ellipsis, size } from 'polished';
import React, { ChangeEvent, Fragment, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { FixedSizeList } from 'react-window';
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

export const RoleListItem = ({ role, sx, ...props }: RoleListItemProps) => (
    <ListItemButton key={role.id} sx={{ px: { xs: 2, sm: 1.5 }, gap: 1.5, ...sx }} {...props}>
        <ListItemIcon sx={{ minWidth: 0 }}>
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
    const ref = useRef<FixedSizeList | null>(null);

    const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up('md'));
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const open = Boolean(anchorEl);

    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const roles = sortRoles(choices).filter((role) => filterPredicateRole(role, search));

    const handlePopupClose = () => {
        setSearch('');
        setSelectedIndex(-1);
        setAnchorEl(null);
    };

    const handleChange = (role: Role) => {
        setValue(role.id);
        handlePopupClose();
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setSelectedIndex(-1);
    };

    const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.isComposing || roles.length < 1) return;

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                if (selectedIndex > -1)
                    handleChange(roles[selectedIndex]);
                return;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((index) => {
                    const i = index > 0 ? index - 1 : roles.length - 1;
                    ref.current?.scrollToItem(i);
                    return i;
                });
                return;
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((index) => {
                    const i = index < roles.length - 1 ? index + 1 : 0;
                    ref.current?.scrollToItem(i);
                    return i;
                });
                return;
        }
    };

    useEffect(() => {
        if (open && isDesktop)
            setTimeout(() => document.getElementById('popover-search')?.focus());
    }, [open, isDesktop]);

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
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                placeholder="役職を検索..."
            />
            <FixedSizeList
                ref={ref}
                width="100%"
                height={300}
                innerElementType={List}
                itemCount={roles.length}
                itemSize={8 * (isSmall ? 6 : 5)}
            >
                {({ index, style }) => {
                    const role = roles[index];
                    return (
                        <RoleListItem
                            key={role.id}
                            role={role}
                            selected={value === role.id}
                            onClick={() => handleChange(role)}
                            sx={{ bgcolor: selectedIndex === index ? 'action.selected' : 'transparent' }}
                            style={{
                                ...style,
                                top: parseFloat(style.top as string) + 8
                            }}
                        />
                    );
                }}
            </FixedSizeList>
        </Popover>
    );
};

export type RoleSelectProps = ItemDisabledProps & RoleProps & SnowflakeSelectProps<RolePopoverProps>;

export const RoleSelect = ({ value, setValue, choices, disabled, sx, popoverProps }: RoleSelectProps) => {
    const ref = useRef<HTMLDivElement | null>(null);

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const role = choices.find((role) => role.id === value);
    return (
        <Fragment>
            <Select
                ref={ref}
                open={Boolean(anchorEl)}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                disabled={disabled}
                sx={sx}
            >
                {role && <Fragment>
                    <Box sx={{ ...size(16), bgcolor: getRoleColor(role), borderRadius: '50%' }} />
                    <Typography>{role.name}</Typography>
                </Fragment>}
            </Select>

            <RolePopover
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                value={value}
                setValue={setValue}
                choices={choices}
                sx={{
                    [`& .${popoverClasses.paper}`]: {
                        minWidth: ref.current?.offsetWidth
                    }
                }}
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
                    sx={{
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
