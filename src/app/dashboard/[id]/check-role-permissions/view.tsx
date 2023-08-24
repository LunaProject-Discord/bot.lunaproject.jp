'use client';

import { Grid, PermissionsItem } from '@app/dashboard/[id]/check-role-permissions/_components';
import { CrownOutlined } from '@components/icons';
import { PageContent, PageHeader } from '@components/layout';
import { ALL_PERMISSIONS } from '@interfaces/permissions';
import { GuildConfigurationViewProps } from '@interfaces/view';
import { Section, SectionContent } from '@lunaproject-discord/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject-discord/web-core/dist/utils';
import { CheckOutlined, CloseOutlined, DeleteOutlined, RemoveOutlined } from '@mui/icons-material';
import { Alert, AlertTitle, Box, Typography } from '@mui/material';
import { sortRoles } from '@utils/discord';
import React, { useMemo } from 'react';

export const View = ({ guild, configuration, localization }: GuildConfigurationViewProps) => {
    const { translations } = localization;

    const [permissions, setPermissions, resetPermissions] = useResettableState(new Map(ALL_PERMISSIONS.map((permission) => [permission, true])));
    const filteredPermissions = useMemo(() => Array.from(permissions).filter(([, value]) => value).map(([key]) => key), [permissions]);

    const roles = sortRoles(guild.roles);

    return (
        <PageContent>
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.role_permissions}</Typography>
                    <Typography>{translations.role_permissions_description}</Typography>
                </Box>
            </PageHeader>
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
                            <CheckOutlined sx={{ mb: 'auto' }} />
                            {translations.role_permissions_how_to_description_yes}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
                            <CloseOutlined sx={{ mb: 'auto' }} />
                            {translations.role_permissions_how_to_description_no}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
                            <RemoveOutlined sx={{ mb: 'auto' }} />
                            {translations.role_permissions_how_to_description_inherited_everyone}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
                            <CrownOutlined sx={{ mb: 'auto' }} />
                            {translations.role_permissions_how_to_description_inherited_administrator}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}>
                            <DeleteOutlined sx={{ mb: 'auto' }} />
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
        </PageContent>
    );
};
