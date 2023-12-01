'use client';

import { LocalizationProps } from '@interfaces/localization';
import { PopoverProps } from '@interfaces/mui';
import { RedisMember } from '@interfaces/redis';
import { Popover } from '@lunaproject/web-core/dist/components/Popover';
import { ItemDisabledProps, ItemProps } from '@lunaproject/web-core/dist/components/SectionItems';
import { GuildMember } from '@lunaproject/web-discord/dist/interfaces/discord';
import {
    Avatar,
    ListItemButtonProps,
    ListItemText,
    popoverClasses,
    Theme,
    Typography,
    useMediaQuery
} from '@mui/material';
import { getMemberAvatar, getUserAvatar } from '@utils/cdn';
import { filterPredicateMember, getMemberDisplayName, sortMembers } from '@utils/discord';
import { ellipsis } from 'polished';
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

type Member = GuildMember | RedisMember;

export interface MemberListItemProps extends ListItemButtonProps {
    member: Member;
}

export const MemberListItem = ({ member, ...props }: MemberListItemProps) => (
    <ListItemButton key={member.user.id} {...props}>
        <ListItemIcon>
            <Avatar
                src={'guild_id' in member ? getMemberAvatar(member, member.guild_id) : getUserAvatar(member.user)}
                alt=" "
                sx={{ width: 24, height: 24, pointerEvents: 'none' }}
            />
        </ListItemIcon>
        <ListItemText
            primary={getMemberDisplayName(member)}
            primaryTypographyProps={{ sx: { ...ellipsis(), display: 'block' } }}
        />
    </ListItemButton>
);

export type MemberProps = SnowflakeItemProps<Member>;

export type MemberPopoverProps = PopoverProps & MemberProps & LocalizationProps;

export const MemberPopover = (
    {
        anchorEl,
        setAnchorEl,
        value,
        setValue,
        choices,
        localization: { translations },
        ...props
    }: MemberPopoverProps
) => {
    const ref = useRef<FixedSizeList | null>(null);

    const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up('md'));
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const open = Boolean(anchorEl);

    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const members = sortMembers(choices).filter((member) => filterPredicateMember(member, search));

    const handlePopupClose = () => {
        setSearch('');
        setSelectedIndex(-1);
        setAnchorEl(null);
    };

    const handleChange = (member: Member) => {
        setValue(member.user.id);
        handlePopupClose();
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setSelectedIndex(-1);
    };

    const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.isComposing || members.length < 1) return;

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                if (selectedIndex > -1)
                    handleChange(members[selectedIndex]);
                return;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((index) => {
                    const i = index > 0 ? index - 1 : members.length - 1;
                    ref.current?.scrollToItem(i);
                    return i;
                });
                return;
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((index) => {
                    const i = index < members.length - 1 ? index + 1 : 0;
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
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                placeholder={translations.search_members as string}
            />
            <FixedSizeList
                ref={ref}
                width="100%"
                height={300}
                innerElementType={List}
                itemCount={members.length}
                itemSize={8 * (isSmall ? 6 : 5)}
            >
                {({ index, style }) => {
                    const member = members[index];
                    return (
                        <MemberListItem
                            key={member.user.id}
                            member={member}
                            selected={value === member.user.id}
                            onClick={() => handleChange(member)}
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

export type MemberSelectProps =
    ItemDisabledProps
    & MemberProps
    & SnowflakeSelectProps<MemberPopoverProps>
    & LocalizationProps;

export const MemberSelect = (
    {
        value,
        setValue,
        choices,
        disabled,
        localization,
        sx,
        popoverProps
    }: MemberSelectProps
) => {
    const ref = useRef<HTMLDivElement | null>(null);

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const member = choices.find((member) => member.user.id === value);
    return (
        <Fragment>
            <Select
                ref={ref}
                open={Boolean(anchorEl)}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                disabled={disabled}
                sx={sx}
            >
                {member && <Fragment>
                    <Avatar
                        src={getMemberAvatar(member, 'guild_id' in member ? member.guild_id : '')}
                        alt=" "
                        sx={{ width: 24, height: 24, pointerEvents: 'none' }}
                    />
                    <Typography>{getMemberDisplayName(member)}</Typography>
                </Fragment>}
            </Select>

            <MemberPopover
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                value={value}
                setValue={setValue}
                choices={choices}
                localization={localization}
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

export type MemberItemProps = ItemProps & MemberProps & LocalizationProps;

export const MemberItem = (
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
        localization,
        sx
    }: MemberItemProps
) => (
    <Fragment>
        <ItemRoot sx={sx}>
            <ItemRowContainer dense={!secondary}>
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
                <MemberSelect
                    value={value}
                    setValue={setValue}
                    choices={choices}
                    disabled={disabled}
                    localization={localization}
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
