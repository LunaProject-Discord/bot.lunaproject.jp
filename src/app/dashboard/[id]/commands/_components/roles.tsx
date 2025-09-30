'use client';

import {
    DefaultEditableItem,
    EditableItem,
    EditableItemProps,
    OverrideGroupProps
} from '@/app/dashboard/[id]/commands/_components';
import { EditablePermissionOverride } from '@/app/dashboard/[id]/commands/interfaces';
import { AddIcon } from '@/components/icons';
import { RolePicker, RolePickerType } from '@/components/picker';
import { GuildRolesViewProps } from '@/interfaces/view';
import { getRoleColor } from '@/utils/discord';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import { PickerChoiceClickHandler } from '@lunaproject/web-core/dist/components/Picker';
import { Section, SectionTitle } from '@lunaproject/web-core/dist/components/Section';
import { getStateActionValue } from '@lunaproject/web-core/dist/utils';
import { Box, Typography } from '@mui/material';
import { nanoid } from 'nanoid';
import { size } from 'polished';
import React, { Fragment, useCallback, useState } from 'react';

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

    const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined);

    const updateOverride = useCallback((id: string, data: EditablePermissionOverride | undefined) => setOverrides((values) => {
        let array = [...values];

        const i = array.findIndex((data) => data._id === id);
        if (i !== -1)
            data ? array.splice(i, 1, data) : array.splice(i, 1);

        if (i === -1 && data)
            array.push(data);

        return array;
    }), [setOverrides]);

    const handleChoiceClick: PickerChoiceClickHandler<RolePickerType> = useCallback((_, role) => {
        const _id = nanoid();
        updateOverride(_id, { _id, id: role.id, override: true });
        setAnchorEl(undefined);
    }, [updateOverride]);

    return (
        <Fragment>
            <Section>
                <SectionTitle sx={{ display: 'flex', alignItems: 'center' }}>
                    {translations.commands_permissions_roles}
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
            </Section>

            <RolePicker
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                choices={roles.filter((role) => !overrides.some(({ id }) => id === role.id))}
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

