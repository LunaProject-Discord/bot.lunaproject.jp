import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React, { Fragment, ReactNode } from 'react';
import { WithIdParamProps } from '../../../interfaces/page';
import { getTranslation } from '../../../languages/server';
import { getGuildSettings } from '../../../libs/bot';
import { getGuildById, getMemberById } from '../../../libs/redis';
import { hasPermission } from '../../../utils/discord';
import { getUser } from '../../utils';
import { Navigation } from './navigation';
import { ForbiddenView, NotFoundView } from './view';

export const generateMetadata = async ({ params: { id } }: WithIdParamProps, parent: ResolvingMetadata) => {
    const translations = getTranslation();

    const user = await getUser();
    const guild = await getGuildById(id);
    if (!user || !guild)
        return parent;

    const member = await getMemberById(user.id, guild.id);
    if (!member || !hasPermission(guild, member))
        return parent;

    const metadata = await parent;
    return {
        ...metadata,
        title: {
            default: `${translations.server_settings} » ${guild.name}`,
            template: `%s [${guild.name}] | 結月 -ゆづき-`
        },
        openGraph: {
            ...metadata.openGraph,
            title: {
                default: `${translations.server_settings} » ${guild.name}`,
                template: `%s [${guild.name}]`
            }
        },
        twitter: {
            ...metadata.twitter,
            title: {
                default: `${translations.server_settings} » ${guild.name}`,
                template: `%s [${guild.name}]`
            }
        },
        robots: {
            ...metadata.robots,
            index: false
        }
    };
};

const Layout = async ({ children, params: { id } }: WithIdParamProps & { children: ReactNode }) => {
    const translations = getTranslation();

    const userData = getUser();

    const guildData = getGuildById(id);
    const guildSettingsData = getGuildSettings(id);

    const [user, guild, guildSettings] = await Promise.all([userData, guildData, guildSettingsData]);

    if (!user)
        return (<ForbiddenView />);

    if (!guild || !guildSettings)
        return (<NotFoundView />);

    const member = await getMemberById(user.id, guild.id);
    if (!member || !hasPermission(guild, member))
        return (<ForbiddenView />);

    return (
        <Fragment>
            <Navigation guild={guild} translations={translations} />
            {children}
        </Fragment>
    );
};

export default Layout;
