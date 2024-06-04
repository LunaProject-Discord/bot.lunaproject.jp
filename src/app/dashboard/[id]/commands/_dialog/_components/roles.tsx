import { EditableItemProps, OverrideGroupProps } from '@/app/dashboard/[id]/commands/_components';
import {
    DefaultEditableItem,
    EditableItem,
    Group,
    GroupTitle
} from '@/app/dashboard/[id]/commands/_dialog/_components/index';
import { EditablePermissionOverride } from '@/app/dashboard/[id]/commands/interfaces';
import { AddIcon } from '@/components/icons';
import { RolePopover } from '@/components/items';
import { GuildRolesViewProps } from '@/interfaces/view';
import { getRoleColor } from '@/utils/discord';
import { getStateActionValue } from '@lunaproject/web-core/dist/utils';
import { Box, Button, Typography } from '@mui/material';
import { nanoid } from 'nanoid';
import { size } from 'polished';
import React, { Fragment, useState } from 'react';

type RoleItemProps = EditableItemProps & GuildRolesViewProps;

export const RoleItem = ({ value, setValue, roles, disabled, localization }: Omit<RoleItemProps, 'children'>) => {
    const role = roles.find((role) => role.id === value.id)!!;
    return (
        <EditableItem value={value} setValue={setValue} disabled={disabled} localization={localization}>
            <Box sx={{ ...size(16), bgcolor: getRoleColor(role), borderRadius: '50%' }} />
            <Typography sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {role.name}
            </Typography>
        </EditableItem>
    );
};

export const Roles = (
    {
        default: defaultValue,
        setDefault,
        overrides,
        setOverrides,
        roles,
        localization
    }: OverrideGroupProps & GuildRolesViewProps
) => {
    const { translations } = localization;

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const updateOverride = (id: string, data: EditablePermissionOverride | undefined) => setOverrides((values) => {
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
                    {translations.command_permissions_roles}
                    <Button
                        onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
                        disableElevation
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        sx={{ ml: 'auto' }}
                    >
                        {translations.add}
                    </Button>
                </GroupTitle>
                <DefaultEditableItem value={defaultValue} setValue={setDefault}>
                    {translations.commands_permissions_all_roles}
                </DefaultEditableItem>
                {overrides.filter((override) => roles.some((role) => role.id === override.id)).map((override) => (
                    <RoleItem
                        key={override._id}
                        value={override}
                        setValue={(action) => updateOverride(override._id, getStateActionValue(action, override))}
                        roles={roles}
                        localization={localization}
                    />
                ))}
            </Group>

            <RolePopover
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                value=""
                setValue={(action) => {
                    const _id = nanoid();
                    updateOverride(_id, { _id, id: getStateActionValue(action, ''), override: true });
                }}
                choices={roles.filter((role) => !overrides.some(({ id }) => id === role.id))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                localization={localization}
            />
        </Fragment>
    );
};

