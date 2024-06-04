'use client';

import { LevelItemProfile } from '@/app/leaderboard/[id]/components';
import { ErrorDescription, ErrorRoot, ErrorTitle } from '@/components/error';
import { CloudOffIcon, DeleteIcon, SearchIcon, TableRowsIcon } from '@/components/icons';
import { SaveConfirmV2 } from '@/components/save_confirm_v2';
import { GuildLevel, PartialGuildLevel, PartialGuildLevelRecord, PartialGuildLevels } from '@/interfaces/bot';
import { LocalizationProps } from '@/interfaces/localization';
import { GuildConfigurationViewProps, GuildViewProps } from '@/interfaces/view';
import { PartialGuildLevelRecordSchema } from '@/schemas/bot';
import { filterPredicateLevel, getLevelPages, getMaxExperience } from '@/utils/level';
import { PageCenteredLayout, PageHeader } from '@lunaproject/web-core/dist/components/Layout';
import { NumberField, numberFieldClasses } from '@lunaproject/web-core/dist/components/NumberField';
import { Section } from '@lunaproject/web-core/dist/components/Section';
import { ItemRowContainer } from '@lunaproject/web-core/dist/components/SectionItems';
import {
    filterPredicateNonNullable,
    getStateActionValue,
    useDebounce,
    useResettableState
} from '@lunaproject/web-core/dist/utils';
import {
    Box,
    BoxProps,
    Button,
    CircularProgress,
    InputBase,
    styled,
    TablePagination,
    Theme,
    Typography,
    useMediaQuery
} from '@mui/material';
import clsx from 'clsx';
import groupBy from 'lodash/groupBy';
import React, { ChangeEvent, Fragment, MouseEvent, SetStateAction, useState } from 'react';

const saveGuildLevels = async (id: string, levels: PartialGuildLevels) => {
    const res = await fetch(
        `/api/guilds/${id}/levels`,
        {
            method: 'PATCH',
            body: JSON.stringify(levels),
            credentials: 'include'
        }
    );

    return res.ok;
};

const ItemContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(0, 1.5),
    containerType: 'inline-size',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color', 'color'], {
        duration: theme.transitions.duration.shortest
    }),
    [`@container (min-width: ${theme.breakpoints.values.sm - 90}px) and (max-width: ${theme.breakpoints.values.md - 70.05}px)`]: {
        [`& .form-container, & .${numberFieldClasses.root}`]: {
            width: '100%'
        }
    }
}));

const ItemFormContainer = styled(
    ({ className, ...props }: BoxProps) => <Box {...props} className={clsx(className, 'form-container')} />
)<BoxProps>(({ theme }) => ({
    height: 50,
    display: 'flex',
    flexShrink: 0,
    placeItems: 'center',
    placeContent: 'center',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        height: 'auto',
        padding: 0,
        flexDirection: 'column',
        gap: theme.spacing(1)
    }
}));

const ItemFormGroup = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    placeItems: 'center',
    placeContent: 'center',
    gap: theme.spacing(1)
}));

interface LevelItemProps extends GuildViewProps {
    value: GuildLevel;
    setValue: (value: PartialGuildLevel) => void;
}

export const LevelItem = ({ guild, value, setValue, localization: { translations } }: LevelItemProps) => {
    const { user, member, rank, level, experience } = value;
    const maxExperience = getMaxExperience(level);

    const handleLevelChange = (action: SetStateAction<number>) => {
        const newLevel = getStateActionValue(action, level);
        const newExperience = Math.min(getMaxExperience(newLevel), experience);

        setValue({ user_id: user.id, level: newLevel, experience: newExperience });
    };

    const setExperience = (action: SetStateAction<number>) => setValue({
        user_id: user.id,
        level,
        experience: getStateActionValue(action, experience)
    });

    return (
        <ItemContainer>
            <ItemRowContainer>
                <LevelItemProfile guild={guild} user={user} member={member} />
            </ItemRowContainer>
            <ItemFormContainer>
                <ItemFormGroup>
                    <Typography variant="body2" sx={{ flexShrink: 0 }}>{translations.level}</Typography>
                    <NumberField
                        value={level}
                        setValue={handleLevelChange}
                        pattern="\d*"
                        step={1}
                        min={0}
                        sx={{
                            width: {
                                xs: '100%',
                                md: 300
                            }
                        }}
                    />
                </ItemFormGroup>
                <ItemFormGroup>
                    <Typography variant="body2" sx={{ flexShrink: 0 }}>{translations.experience}</Typography>
                    <NumberField
                        value={experience}
                        setValue={setExperience}
                        pattern="\d*"
                        step={1}
                        min={0}
                        max={maxExperience}
                        sx={{
                            width: {
                                xs: '100%',
                                md: 300
                            }
                        }}
                    />
                </ItemFormGroup>
                <ItemFormGroup sx={{ width: 'auto', flexShrink: 0 }}>
                    <Button
                        onClick={() => setValue({ user_id: user.id, level: 0, experience: 0 })}
                        variant="text"
                        color="error"
                        fullWidth
                        startIcon={<DeleteIcon />}
                    >
                        {translations.reset}
                    </Button>
                </ItemFormGroup>
            </ItemFormContainer>
        </ItemContainer>
    );
};

interface Props extends GuildConfigurationViewProps {
    levels: GuildLevel[];
}

export const View = ({ guild, levels, localization }: Props) => {
    const { translations } = localization;

    const isMedium = useMediaQuery<Theme>((theme) => theme.breakpoints.up('md'));

    const [pageIndex, setPageIndex] = useState(0);
    const [perPageLimit, setPerPageLimit] = useState(50);

    const [values, setValues, resetValues] = useResettableState<PartialGuildLevels>([]);

    const [search, setSearch] = useState('');
    const keyword = useDebounce(search, 500);

    const filteredLevels = levels.filter((level) => filterPredicateLevel(level, keyword));
    const levelPages = getLevelPages(filteredLevels, perPageLimit);
    const data = (keyword.length < 1 ? levelPages[pageIndex] : filteredLevels) ?? [];

    const updateValue = (value: PartialGuildLevel) => setValues((values) => {
        const data = [...values];

        const i = data.findIndex((level) => level.user_id === value.user_id);
        if (i !== -1)
            data.splice(i, 1);

        const current = filteredLevels.find((level) => level.user.id === value.user_id);
        if (value.level !== current?.level || value.experience !== current?.experience)
            data.push(value);

        return data;
    });

    const handlePageIndexChange = (e: MouseEvent<HTMLButtonElement> | null, index: number) => setPageIndex(index);

    const handlePerPageLimitChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPerPageLimit(Number(e.target.value));
        setPageIndex(0);
    };

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

    if (keyword.length < 1 && data.length < 1)
        return (<NotFoundView localization={localization} />);

    return (
        <Fragment>
            <PageHeader primary={translations.level_manage} secondary={translations.level_description} />
            <Box
                sx={(theme) => ({
                    width: '100%',
                    py: 2,
                    position: 'sticky',
                    top: { xs: theme.spacing(7), sm: theme.spacing(8) },
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    gap: 2,
                    zIndex: 1,
                    bgcolor: 'background.paper'
                })}
            >
                <Box
                    sx={{
                        width: '100%',
                        px: 1.5,
                        py: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        bgcolor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
                        borderRadius: 1
                    }}
                >
                    <SearchIcon color="action" />
                    <InputBase
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={translations.search_members as string}
                        fullWidth
                    />
                </Box>
                <TablePagination
                    component={Box}
                    count={filteredLevels.length}
                    page={pageIndex}
                    onPageChange={handlePageIndexChange}
                    rowsPerPage={perPageLimit}
                    onRowsPerPageChange={handlePerPageLimitChange}
                    labelRowsPerPage={<TableRowsIcon />}
                    showFirstButton={isMedium}
                    showLastButton={isMedium}
                />
            </Box>
            {data.length > 0 ? <Section sx={{ p: 0, gap: 1 }}>
                {data.map((level) => {
                    const data = values.find((value) => value.user_id === level.user.id);

                    return (
                        <LevelItem
                            key={level.user.id}
                            guild={guild}
                            value={{ ...level, ...data }}
                            setValue={updateValue}
                            localization={localization}
                        />
                    );
                })}
            </Section> : <ErrorRoot>
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
