import { EditableItemProps, GroupProps } from '@app/dashboard/[id]/commands/_components';
import { EditableItem, Group, GroupTitle } from '@app/dashboard/[id]/commands/_dialog/_components/index';
import { EditablePermissionOverride } from '@app/dashboard/[id]/commands/interfaces';
import { MemberPopover } from '@components/items/discord/member';
import { GuildMembersViewProps } from '@interfaces/view';
import { ItemIcon, ItemTextBlock } from '@lunaproject-discord/web-core/dist/components/SectionItems';
import { AddOutlined } from '@mui/icons-material';
import { Avatar, Box, Button } from '@mui/material';
import { getMemberAvatar } from '@utils/cdn';
import { getStateActionValue } from '@utils/state';
import { nanoid } from 'nanoid';
import React, { Fragment, useState } from 'react';

type MemberItemProps = EditableItemProps & GuildMembersViewProps;

export const MemberItem = ({ value, setValue, members, disabled, localization }: Omit<MemberItemProps, 'children'>) => {
    const member = members.find((member) => member.id === value.id)!!;
    return (
        <EditableItem value={value} setValue={setValue} disabled={disabled} localization={localization}>
            <ItemIcon
                icon={
                    <Avatar
                        src={getMemberAvatar(member, member.guild_id)}
                        alt=" "
                        sx={{ pointerEvents: 'none' }}
                    />
                }
            />
            <ItemTextBlock
                primary={member.nick ?? member.user.display_name ?? <Fragment>
                    {member.user.name}
                    <Box component="span" sx={{ fontFamily: 'Renner', color: 'text.secondary' }}>
                        #{member.user.discriminator}
                    </Box>
                </Fragment>}
                secondary={Number(member.user.discriminator) === 0 ? `@${member.user.name}` : (
                    (member.nick || member.user.display_name) ?
                        <Fragment>
                            {member.user.name}
                            <Box component="span" sx={{ fontFamily: 'Renner', color: 'text.secondary' }}>
                                #{member.user.discriminator}
                            </Box>
                        </Fragment>
                        :
                        undefined
                )}
                secondaryTypographyProps={{
                    sx: {
                        color: Number(member.user.discriminator) === 0 ? undefined : 'text.primary'
                    }
                }}
            />
        </EditableItem>
    );
};

export const Members = ({ value, setValue, members, localization }: GroupProps & GuildMembersViewProps) => {
    const { translations } = localization;

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const updateValue = (id: string, data: EditablePermissionOverride | undefined) => setValue((values) => {
        let array = [...values];

        const i = array.findIndex((data) => data._id === id);
        if (i !== -1)
            data ? array.splice(i, 1, data) : array.splice(i, 1);

        if (i === -1 && data)
            array.push(data);

        return array;
    });

    return (
        <Fragment>
            <Group>
                <GroupTitle>
                    {translations.command_permissions_members}
                    <Button
                        onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
                        disableElevation
                        variant="contained"
                        color="inherit"
                        size="small"
                        startIcon={<AddOutlined />}
                        sx={{ ml: 'auto' }}
                    >
                        {translations.add}
                    </Button>
                </GroupTitle>
                {value.filter((override) => members.some((member) => member.id === override.id)).map((member) => (
                    <MemberItem
                        key={member._id}
                        value={member}
                        setValue={(action) => updateValue(member._id, getStateActionValue(action, member))}
                        members={members}
                        localization={localization}
                    />
                ))}
            </Group>

            <MemberPopover
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                value=""
                setValue={(action) => {
                    const _id = nanoid();
                    updateValue(_id, { _id, id: getStateActionValue(action, ''), override: true });
                }}
                choices={members.filter((member) => !value.some(({ id }) => id === member.id))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                localization={localization}
            />
        </Fragment>
    );
};

