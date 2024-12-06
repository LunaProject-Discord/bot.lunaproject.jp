'use client';

import { ErrorDescription, ErrorRoot, ErrorTitle } from '@/components/error';
import { CloudOffIcon, SearchIcon } from '@/components/icons';
import { SaveConfirmV2 } from '@/components/save_confirm_v2';
import { SectionLevelEdit, SectionLevelEditHeader } from '@/components/section';
import { GuildLevel, PartialGuildLevel, PartialGuildLevelRecord, PartialGuildLevels } from '@/interfaces/bot';
import { LocalizationProps } from '@/interfaces/localization';
import { GuildConfigurationViewProps } from '@/interfaces/view';
import { PartialGuildLevelRecordSchema } from '@/schemas/bot';
import { filterPredicateLevel } from '@/utils/level';
import { PageCenteredLayout, PageHeader } from '@lunaproject/web-core/dist/components/Layout';
import { Section } from '@lunaproject/web-core/dist/components/Section';
import {
    filterPredicateNonNullable,
    getStateActionValue,
    useDebounce,
    useResettableState
} from '@lunaproject/web-core/dist/utils';
import { Box, CircularProgress, InputBase } from '@mui/material';
import groupBy from 'lodash/groupBy';
import React, { Fragment, SetStateAction, useCallback, useState } from 'react';

const saveGuildLevels = async (id: string, levels: PartialGuildLevels) => {
    const response = await fetch(
        `/api/guilds/${id}/levels`,
        {
            method: 'PATCH',
            body: JSON.stringify(levels),
            credentials: 'include'
        }
    );

    return response.ok;
};

interface ViewProps extends GuildConfigurationViewProps {
    levels: GuildLevel[];
}

export const View = ({ guild, levels, localization }: ViewProps) => {
    const { translations } = localization;

    const [values, setValues, resetValues] = useResettableState<PartialGuildLevels>([]);

    const [search, setSearch] = useState('');
    const keyword = useDebounce(search, 500);

    const filteredLevels = levels.filter((level) => filterPredicateLevel(level, keyword));

    const setValue = useCallback((userId: string) => (action: SetStateAction<PartialGuildLevel>) => {
        const value = getStateActionValue(
            action,
            values.find((value) => value.user_id === userId) ?? { user_id: userId, level: 0, experience: 0 }
        );

        setValues((values) => {
            const data = [...values];

            const i = data.findIndex((level) => level.user_id === userId);
            if (i !== -1)
                data.splice(i, 1);

            const current = levels.find((level) => level.user.id === userId);
            if (value.level !== current?.level || value.experience !== current?.experience)
                data.push(value);

            return data;
        });
    }, [values, setValues, levels]);

    const toSourceObject = (): PartialGuildLevelRecord => {
        const store: PartialGuildLevelRecord = {};

        values.map((value) => levels.find((level) => level.user.id === value.user_id))
            .filter(filterPredicateNonNullable)
            .forEach((level) => {
                store[level.user.id] = { user_id: level.user.id, level: level.level, experience: level.experience };
            });

        return store;
    };

    const toTargetObject = (): PartialGuildLevelRecord => {
        const store: PartialGuildLevelRecord = {};

        for (const value of values)
            store[value.user_id] = { user_id: value.user_id, level: value.level, experience: value.experience };

        return store;
    };

    const handleSaveAction = async () => {
        const result = await saveGuildLevels(guild.id, values);
        if (result)
            resetValues();

        return result;
    };

    const handleCancelAction = () => {
        resetValues();
    };

    if (keyword.length < 1 && filteredLevels.length < 1)
        return (<NotFoundView localization={localization} />);

    return (
        <Fragment>
            <PageHeader primary={translations.level_manage} secondary={translations.level_description} />
            <Box
                sx={(theme) => ({
                    width: '100%',
                    pt: 2,
                    pb: { xs: 2, md: .75 },
                    position: 'sticky',
                    top: { xs: theme.spacing(7), sm: theme.spacing(8) },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    zIndex: 1,
                    bgcolor: 'background.paper'
                })}
            >
                <Box
                    sx={(theme) => ({
                        width: '100%',
                        px: 1.5,
                        py: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        bgcolor: theme.vars.palette.grey[100],
                        borderRadius: 1,
                        ...theme.applyStyles('dark', {
                            bgcolor: theme.vars.palette.grey[900]
                        })
                    })}
                >
                    <SearchIcon color="action" />
                    <InputBase
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={translations.search_members as string}
                        fullWidth
                    />
                </Box>
                <SectionLevelEditHeader localization={localization} />
            </Box>
            {filteredLevels.length > 0 ? <SectionLevelEdit
                guild={guild}
                levels={filteredLevels}
                partialLevels={values}
                updateLevel={setValue}
                localization={localization}
            /> : <ErrorRoot>
                <CloudOffIcon sx={{ fontSize: '10rem' }} />
                <ErrorTitle>{translations.error_member_not_found_title}</ErrorTitle>
                <ErrorDescription>{translations.error_member_not_found_description}</ErrorDescription>
            </ErrorRoot>}

            <SaveConfirmV2
                source={toSourceObject()}
                target={toTargetObject()}
                schema={PartialGuildLevelRecordSchema}
                groupByPath={(changes) => groupBy(
                    changes,
                    (change) => {
                        const path = change.path;
                        return path.substring(0, path.lastIndexOf('.'));
                    }
                )}
                onSave={handleSaveAction}
                onCancel={handleCancelAction}
                localization={localization}
            />
        </Fragment>
    );
};

export const LoadingView = ({ localization: { translations } }: LocalizationProps) => (
    <Fragment>
        <PageHeader primary={translations.level_manage} secondary={translations.loading} />
        <Section sx={{ height: '100%', p: 0, placeItems: 'center', placeContent: 'center' }}>
            <CircularProgress />
        </Section>
    </Fragment>
);

export const NotFoundView = ({ localization: { translations } }: LocalizationProps) => (
    <PageCenteredLayout>
        <PageHeader primary={translations.level_manage} />
        <ErrorRoot>
            <CloudOffIcon sx={{ fontSize: '10rem' }} />
            <ErrorTitle>データがありません</ErrorTitle>
            <ErrorDescription>
                このサーバーではまだ誰も発言していないようです...<br />
                サーバーで発言してからしばらく待った後に再度お試しください。
            </ErrorDescription>
        </ErrorRoot>
    </PageCenteredLayout>
);
