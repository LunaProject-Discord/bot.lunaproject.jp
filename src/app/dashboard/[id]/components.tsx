'use client';

import { ItemVariableProps, List, ListItemButton, ListItemIcon, SearchBox, Select } from '@components/items';
import { Popover } from '@lunaproject-discord/web-core/dist/components/Popover';
import { ItemDisabledProps } from '@lunaproject-discord/web-core/dist/components/SectionItems';
import { OAuthGuild } from '@lunaproject-discord/web-discord/dist/interfaces/discord';
import {
    Avatar,
    ListItemButtonProps,
    ListItemText,
    PopoverProps,
    Theme,
    Typography,
    useMediaQuery
} from '@mui/material';
import { filterPredicateGuild, getGuildIcon, sortGuilds } from '@utils/discord';
import { ellipsis } from 'polished';
import React, { Fragment, MouseEvent, useEffect, useState } from 'react';
import { FixedSizeList } from 'react-window';

interface ListItemProps extends ListItemButtonProps {
    guild: OAuthGuild;
}

const ListItem = ({ guild, ...props }: ListItemProps) => (
    <ListItemButton key={guild.id} {...props}>
        <ListItemIcon>
            <Avatar
                src={getGuildIcon(guild)}
                alt=" "
                sx={{ width: 24, height: 24, pointerEvents: 'none' }}
            />
        </ListItemIcon>
        <ListItemText primary={guild.name} primaryTypographyProps={{ sx: { ...ellipsis(), display: 'block' } }} />
    </ListItemButton>
);

interface Props extends ItemVariableProps<string> {
    guilds: OAuthGuild[];
    mutualGuilds: string[];
}

interface GuildPopoverProps extends PopoverProps, Props {
    anchorEl: PopoverProps['anchorEl'];
    onPopupClose: () => void;
}

export const GuildPopover = (
    {
        open,
        anchorEl,
        onPopupClose,
        value,
        setValue,
        guilds: choices,
        mutualGuilds,
        ...props
    }: GuildPopoverProps
) => {
    const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up('md'));
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const [search, setSearch] = useState('');

    const guilds = sortGuilds(choices).filter((guild) => mutualGuilds.includes(guild.id) && filterPredicateGuild(guild, search)) as OAuthGuild[];

    const handlePopupClose = () => {
        setSearch('');
        onPopupClose();
    };

    const handleChange = (guild: OAuthGuild) => {
        setValue(guild.id);
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
            slotProps={{
                paper: {
                    sx: {
                        width: 300
                    }
                }
            }}
            sx={{ zIndex: 1600 }}
            {...props}
        >
            <SearchBox
                id="popover-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="サーバーを検索..."
            />
            <FixedSizeList
                width="100%"
                height={300}
                innerElementType={List}
                itemCount={guilds.length}
                itemSize={8 * (isSmall ? 6 : 5)}
            >
                {({ index, style }) => {
                    const guild = guilds[index];
                    return (
                        <ListItem
                            key={guild.id}
                            guild={guild}
                            selected={value === guild.id}
                            onClick={() => handleChange(guild)}
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

type GuildSelectProps = Props & ItemDisabledProps;

export const GuildSelect = ({ value, setValue, guilds, mutualGuilds, disabled }: GuildSelectProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const open = Boolean(anchorEl);

    const handlePopoverOpen = (e: MouseEvent<HTMLDivElement>) => setAnchorEl(e.currentTarget);
    const handlePopoverClose = () => setAnchorEl(null);

    const currentGuild = guilds.find((guild) => guild.id === value);
    return (
        <Fragment>
            <Select
                open={open}
                onClick={handlePopoverOpen}
                disabled={disabled}
                sx={{
                    pl: 1.5,
                    '& div:first-child': {
                        gap: 1
                    }
                }}
            >
                {currentGuild && <Fragment>
                    <Avatar
                        src={getGuildIcon(currentGuild)}
                        alt=" "
                        sx={{ width: 24, height: 24, pointerEvents: 'none' }}
                    />
                    <Typography>{currentGuild.name}</Typography>
                </Fragment>}
            </Select>

            <GuildPopover
                open={open}
                anchorEl={anchorEl}
                onPopupClose={handlePopoverClose}
                value={value}
                setValue={setValue}
                guilds={guilds}
                mutualGuilds={mutualGuilds}
            />
        </Fragment>
    );
};
