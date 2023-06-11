'use client';

import { PopoverProps } from '@interfaces/mui';
import { RedisMember } from '@interfaces/redis';
import { Popover } from '@lunaproject-discord/web-core/dist/components/Popover';
import { ItemDisabledProps, ItemProps } from '@lunaproject-discord/web-core/dist/components/SectionItems';
import { GuildMember } from '@lunaproject-discord/web-discord/dist/interfaces/discord';
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
import React, { Fragment, useEffect, useRef, useState } from 'react';
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

export type MemberPopoverProps = PopoverProps & MemberProps;

export const MemberPopover = (
    {
        anchorEl,
        setAnchorEl,
        value,
        setValue,
        choices,
        ...props
    }: MemberPopoverProps
) => {
    const isDesktop = useMediaQuery<Theme>((theme) => theme.breakpoints.up('md'));
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const open = Boolean(anchorEl);

    const [search, setSearch] = useState('');

    const members = sortMembers(choices).filter((member) => filterPredicateMember(member, search));

    const handlePopupClose = () => {
        setSearch('');
        setAnchorEl(null);
    };

    const handleChange = (member: Member) => {
        setValue(member.user.id);
        handlePopupClose();
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder="メンバーを検索..."
            />
            <FixedSizeList
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

export type MemberSelectProps = ItemDisabledProps & MemberProps & SnowflakeSelectProps<MemberPopoverProps>;

export const MemberSelect = ({ value, setValue, choices, disabled, sx, popoverProps }: MemberSelectProps) => {
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

export type MemberItemProps = ItemProps & MemberProps;

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
        sx
    }: MemberItemProps
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
                <MemberSelect
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
