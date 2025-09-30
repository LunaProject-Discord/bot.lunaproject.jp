'use client';

import { EditableItem, EditableItemProps, GroupProps } from '@/app/dashboard/[id]/commands/_components';
import { EditablePermissionOverride } from '@/app/dashboard/[id]/commands/interfaces';
import { getMemberDisplay } from '@/app/user';
import { AddIcon } from '@/components/icons';
import { MemberPicker, MemberPickerType } from '@/components/picker';
import { GuildMembersViewProps } from '@/interfaces/view';
import { getMemberAvatar } from '@/utils/cdn';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import { PickerChoiceClickHandler } from '@lunaproject/web-core/dist/components/Picker';
import { Section, SectionTitle } from '@lunaproject/web-core/dist/components/Section';
import { SectionCardDisplay } from '@lunaproject/web-core/dist/components/SectionCard';
import { getStateActionValue } from '@lunaproject/web-core/dist/utils';
import { Avatar } from '@mui/material';
import { nanoid } from 'nanoid';
import React, { Fragment, useCallback, useState } from 'react';

type MemberItemProps = EditableItemProps & GuildMembersViewProps;

export const MemberItem = ({ value, setValue, members, disabled, localization }: Omit<MemberItemProps, 'children'>) => {
    const member = members.find((member) => member.id === value.id)!!;
    const [primary, secondary] = getMemberDisplay(member);

    return (
        <EditableItem value={value} setValue={setValue} disabled={disabled} localization={localization}>
            <SectionCardDisplay
                icon={
                    <Avatar
                        src={getMemberAvatar(member, member.guild_id)}
                        alt=" "
                        sx={{ pointerEvents: 'none' }}
                    />
                }
                primary={primary}
                secondary={secondary}
                slotProps={{
                    primary: {
                        sx: {
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden'
                        }
                    },
                    secondary: {
                        sx: {
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden'
                        }
                    }
                }}
            />
        </EditableItem>
    );
};

export const Members = ({ value, setValue, members, localization }: GroupProps & GuildMembersViewProps) => {
    const { translations } = localization;

    const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined);

    const updateValue = useCallback((id: string, data: EditablePermissionOverride | undefined) => setValue((values) => {
        let array = [...values];

        const i = array.findIndex((data) => data._id === id);
        if (i !== -1)
            data ? array.splice(i, 1, data) : array.splice(i, 1);

        if (i === -1 && data)
            array.push(data);

        return array;
    }), [setValue]);

    const handleChoiceClick: PickerChoiceClickHandler<MemberPickerType> = useCallback((_, member) => {
        const _id = nanoid();
        updateValue(_id, { _id, id: member.user.id, override: true });
        setAnchorEl(undefined);
    }, [updateValue]);

    return (
        <Fragment>
            <Section>
                <SectionTitle sx={{ display: 'flex', alignItems: 'center' }}>
                    {translations.commands_permissions_members}
                    <Button
                        onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
                        disableElevation
                        variant="outlined"
                        corners="extended"
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

            <MemberPicker
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                choices={members.filter((member) => !value.some(({ id }) => id === member.id))}
                onClick={handleChoiceClick}
                slotProps={{
                    desktop: {
                        root: {
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'right'
                            },
                            transformOrigin: {
                                vertical: 'top',
                                horizontal: 'right'
                            }
                        }
                    }
                }}
                localization={localization}
            />
        </Fragment>
    );
};

