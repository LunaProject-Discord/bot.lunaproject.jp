import { EditableItem, EditableItemProps, GroupProps } from '@/app/dashboard/[id]/commands/_components';
import { EditablePermissionOverride } from '@/app/dashboard/[id]/commands/interfaces';
import { getMemberDisplay } from '@/app/user';
import { AddIcon } from '@/components/icons';
import { MemberPopover } from '@/components/items';
import { GuildMembersViewProps } from '@/interfaces/view';
import { getMemberAvatar } from '@/utils/cdn';
import { getStateActionValue } from '@/utils/react/state';
import { Section, SectionTitle } from '@lunaproject/web-core/dist/components/Section';
import { ItemIcon, ItemTextBlock } from '@lunaproject/web-core/dist/components/SectionItems';
import { Avatar, Button } from '@mui/material';
import { nanoid } from 'nanoid';
import React, { Fragment, useState } from 'react';

type MemberItemProps = EditableItemProps & GuildMembersViewProps;

export const MemberItem = ({ value, setValue, members, disabled, localization }: Omit<MemberItemProps, 'children'>) => {
    const member = members.find((member) => member.id === value.id)!!;
    const [primary, secondary] = getMemberDisplay(member);

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
                primary={primary}
                secondary={secondary}
                primaryTypographyProps={{
                    sx: {
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                    }
                }}
                secondaryTypographyProps={{
                    sx: {
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
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
            <Section>
                <SectionTitle sx={{ display: 'flex', alignItems: 'center' }}>
                    {translations.commands_permissions_members}
                    <Button
                        onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
                        disableElevation
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ ml: 'auto' }}
                    >
                        {translations.add}
                    </Button>
                </SectionTitle>
                {value.filter((override) => members.some((member) => member.id === override.id)).map((member) => (
                    <MemberItem
                        key={member._id}
                        value={member}
                        setValue={(action) => updateValue(member._id, getStateActionValue(action, member))}
                        members={members}
                        localization={localization}
                    />
                ))}
            </Section>

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

