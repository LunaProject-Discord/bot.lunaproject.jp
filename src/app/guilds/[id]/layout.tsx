import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
import React, { Fragment, ReactNode } from 'react';
import { WithIdParamProps } from '../../../interfaces/page';
import { getTranslation } from '../../../languages/server';
import { getGuildSettings } from '../../../libs/bot';
import { hasPermission } from '../../../utils/discord';
import { getGuildById } from '../../utils';
import { Navigation } from './navigation';
import { ForbiddenView, NotFoundView } from './view';

export const generateMetadata = async ({ params: { id } }: WithIdParamProps, parent: ResolvingMetadata) => {
    const translations = getTranslation();

    const guild = await getGuildById(id);
    if (!guild || !hasPermission(guild))
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
        }
    };
};

const Layout = async ({ children, params: { id } }: WithIdParamProps & { children: ReactNode }) => {
    const translations = getTranslation();

    const guildData = getGuildById(id);
    const guildSettingsData = getGuildSettings(id);

    const [guild, guildSettings] = await Promise.all([guildData, guildSettingsData]);

    if (!guild || !guildSettings)
        return (<NotFoundView />);

    if (!hasPermission(guild))
        return (<ForbiddenView />);

    return (
        <Fragment>
            <Navigation guild={guild} translations={translations} />
            {children}
        </Fragment>
    );
};

export default Layout;
