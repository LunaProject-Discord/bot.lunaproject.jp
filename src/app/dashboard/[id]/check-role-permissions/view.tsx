'use client';

import { Grid, PermissionsItem } from '@/app/dashboard/[id]/check-role-permissions/_components';
import { CheckIcon, CloseIcon, CrownOutlined, DeleteIcon, RemoveIcon } from '@/components/icons';
import { PageHeader } from '@/components/layout_v2';
import { ALL_PERMISSIONS } from '@/interfaces/permissions';
import { GuildConfigurationViewProps } from '@/interfaces/view';
import { sortRoles } from '@/utils/discord';
import { Section, SectionContent } from '@lunaproject/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject/web-core/dist/utils';
import { Alert, AlertTitle, Box } from '@mui/material';
import React, { Fragment, useMemo } from 'react';

export const View = ({ guild, configuration, localization }: GuildConfigurationViewProps) => {
    const { translations } = localization;

    const [permissions, setPermissions, resetPermissions] = useResettableState(new Map(ALL_PERMISSIONS.map((permission) => [permission, true])));
    const filteredPermissions = useMemo(() => Array.from(permissions).filter(([, value]) => value).map(([key]) => key), [permissions]);

    const roles = sortRoles(guild.roles);

    return (
        <Fragment>
            <PageHeader
                primary={translations.role_permissions}
                secondary={translations.role_permissions_description}
            />
            <Section>
                <SectionContent>
                    <PermissionsItem value={permissions} setValue={setPermissions} localization={localization} />
                </SectionContent>
            </Section>
            <Section>
                <SectionContent>
                    <Alert severity="info">
                        <AlertTitle>{translations.role_permissions_how_to}</AlertTitle>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
                            <CheckIcon sx={{ mb: 'auto' }} />
                            {translations.role_permissions_how_to_description_yes}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
                            <CloseIcon sx={{ mb: 'auto' }} />
                            {translations.role_permissions_how_to_description_no}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
                            <RemoveIcon sx={{ mb: 'auto' }} />
                            {translations.role_permissions_how_to_description_inherited_everyone}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
                            <CrownOutlined sx={{ mb: 'auto' }} />
                            {translations.role_permissions_how_to_description_inherited_administrator}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
                            <DeleteIcon sx={{ mb: 'auto' }} />
                            {translations.role_permissions_how_to_description_deletable}
                        </Box>
                    </Alert>
                </SectionContent>
            </Section>
            <Grid
                guild={guild}
                roles={roles}
                permissions={filteredPermissions}
                localization={localization}
            />
        </Fragment>
    );
};
