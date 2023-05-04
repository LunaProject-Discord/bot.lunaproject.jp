'use client';

import { NumberField } from '@lunaproject-discord/web-core/dist/components/NumberField';
import { Section } from '@lunaproject-discord/web-core/dist/components/Section';
import { useResettableState } from '@lunaproject-discord/web-core/dist/utils/state';
import { borderAndBoxShadow } from '@lunaproject-discord/web-core/dist/utils/theme';
import { ClearAllOutlined, CloudOffOutlined, SearchOutlined, TableRowsOutlined } from '@mui/icons-material';
import {
    Avatar,
    Box,
    BoxProps,
    Button,
    CircularProgress,
    InputBase,
    styled,
    TablePagination,
    tablePaginationClasses,
    Typography
} from '@mui/material';
import clsx from 'clsx';
import React, { ChangeEvent, Fragment, MouseEvent, useState } from 'react';
import { ItemIcon, ItemRowContainer, ItemTextBlock } from '../../../../../components/items';
import { PageContent, PageHeader } from '../../../../../components/layout';
import { SaveConfirm } from '../../../../../components/save_confirm';
import { GuildLevel, PartialGuildLevel } from '../../../../../interfaces/bot';
import { LocalizationProps } from '../../../../../interfaces/localization';
import { DataGuild, RedisMember } from '../../../../../interfaces/redis';
import { GuildSettingsViewProps } from '../../../../../interfaces/view';
import { getMemberAvatar } from '../../../../../utils/cdn';
import { filterPredicateMember } from '../../../../../utils/discord';

const saveGuildLevels = async (id: string, levels: PartialGuildLevel[]) => {
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color', 'color'], {
        duration: theme.transitions.duration.shortest
    })
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
    [theme.breakpoints.down('md')]: {
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

interface LevelItemProps extends LocalizationProps {
    guild: DataGuild;
    member: RedisMember;
    value: PartialGuildLevel;
    setValue: (value: PartialGuildLevel) => void;
}

export const LevelItem = ({ guild, member, value, setValue, localization: { translations } }: LevelItemProps) => (
    <ItemContainer>
        <ItemRowContainer>
            <ItemIcon
                icon={
                    <Avatar
                        src={getMemberAvatar(member, guild)}
                        sx={{ pointerEvents: 'none' }}
                    />
                }
            />
            <ItemTextBlock
                primary={member.nick ?? member.user.name}
                secondary={member.nick ? <Fragment>
                    <Box component="span" sx={{ color: (theme) => theme.palette.text.primary }}>
                        {member.user.name}
                    </Box>
                    #{member.user.discriminator}
                </Fragment> : `#${member.user.discriminator}`}
            />
        </ItemRowContainer>
        <ItemFormContainer>
            <ItemFormGroup>
                <Typography variant="body2" sx={{ flexShrink: 0 }}>{translations.level}</Typography>
                <NumberField
                    value={value.level}
                    setValue={(level) => setValue({ ...value, level })}
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
                    value={value.xp}
                    setValue={(xp) => setValue({ ...value, xp })}
                    min={0}
                    max={20 * Math.max(value.level, 1)}
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
                    onClick={() => setValue({ ...value, level: 0, xp: 0 })}
                    fullWidth
                    variant="text"
                    color="error"
                    startIcon={<ClearAllOutlined />}
                >
                    {translations.reset}
                </Button>
            </ItemFormGroup>
        </ItemFormContainer>
    </ItemContainer>
);

interface Props extends GuildSettingsViewProps {
    levels: GuildLevel[];
}

export const View = ({ guild, levels, localization }: Props) => {
    const { translations } = localization;

    const [pageIndex, setPageIndex] = useState(0);
    const [perPageLimit, setPerPageLimit] = useState(50);

    const [values, setValues, resetValues] = useResettableState<PartialGuildLevel[]>([]);

    const [search, setSearch] = useState('');

    const levelPages = new Array(Math.ceil(levels.length / perPageLimit)).fill(undefined).map((_, i) => levels.slice(i * perPageLimit, (i + 1) * perPageLimit));
    const data = (search.length < 1 ? levelPages[pageIndex] : levels) ?? [];

    const updateValue = (value: PartialGuildLevel) => setValues((values) => {
        let data = [...values];

        const i = data.findIndex((level) => level.user_id === value.user_id);
        if (i !== -1)
            data.splice(i, 1);

        const current = levels.find((level) => level.user.id === value.user_id);
        if (value.level !== current?.level || value.xp !== current?.xp)
            data.push(value);

        return data;
    });

    const handlePageIndexChange = (e: MouseEvent<HTMLButtonElement> | null, index: number) => setPageIndex(index);

    const handlePerPageLimitChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPerPageLimit(Number(e.target.value));
        setPageIndex(0);
    };

    const handleActionSave = async () => {
        const result = await saveGuildLevels(
            guild.id,
            values
        );

        if (result)
            resetValues();

        return result;
    };

    const handleActionCancel = () => {
        resetValues();
    };

    if (data.length < 1)
        return (<NotFoundView localization={localization} />);

    return (
        <PageContent>
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.level_manage}</Typography>
                    <Typography variant="body1">{translations.level_description}</Typography>
                </Box>
            </PageHeader>
            <Box
                sx={{
                    width: '100%',
                    py: 3,
                    position: 'sticky',
                    top: { xs: 57, md: 0 },
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    gap: 2,
                    zIndex: 1,
                    bgcolor: 'background.paper'
                }}
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
                    <SearchOutlined color="action" />
                    <InputBase
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={translations.search_members as string}
                        fullWidth
                    />
                </Box>
                <TablePagination
                    component={Box}
                    count={levels.length}
                    page={pageIndex}
                    onPageChange={handlePageIndexChange}
                    rowsPerPage={perPageLimit}
                    onRowsPerPageChange={handlePerPageLimitChange}
                    labelRowsPerPage={<TableRowsOutlined />}
                    SelectProps={{
                        MenuProps: {
                            PaperProps: {
                                sx: (theme) => borderAndBoxShadow(theme)
                            }
                        }
                    }}
                    sx={{
                        flexShrink: 0,
                        userSelect: 'none',
                        border: 'none',
                        [`& .${tablePaginationClasses.toolbar}`]: {
                            p: 0
                        },
                        [`& .${tablePaginationClasses.selectLabel}`]: {
                            lineHeight: 0
                        }
                    }}
                />
            </Box>
            <Section sx={{ p: 0, gap: 1 }}>
                {data.filter((level) => guild.members.some((member) => member.user.id === level.user.id && filterPredicateMember(member, search)))
                    .map((level) => {
                        const data = values.find((value) => value.user_id === level.user.id);
                        const member = guild.members.find((member) => member.user.id === level.user.id)!!;

                        return (
                            <LevelItem
                                key={level.user.id}
                                guild={guild}
                                member={member}
                                value={data ?? { user_id: level.user.id, level: level.level, xp: level.xp }}
                                setValue={updateValue}
                                localization={localization}
                            />
                        );
                    })
                }
            </Section>

            <SaveConfirm open={values.length > 0} onSave={handleActionSave} onCancel={handleActionCancel} />
        </PageContent>
    );
};

export const LoadingView = ({ localization: { translations } }: LocalizationProps) => (
    <PageContent display="flex">
        <PageHeader>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                <Typography variant="h4">{translations.level_manage}</Typography>
                <Typography variant="body1">{translations.level_description}</Typography>
            </Box>
        </PageHeader>
        <Section sx={{ height: '100%', p: 0, placeItems: 'center', placeContent: 'center' }}>
            <CircularProgress />
        </Section>
    </PageContent>
);

export const NotFoundView = ({ localization: { translations } }: LocalizationProps) => (
    <PageContent display="flex">
        <PageHeader>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                <Typography variant="h4">{translations.level_manage}</Typography>
                <Typography variant="body1">{translations.level_description}</Typography>
            </Box>
        </PageHeader>
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                placeItems: 'center',
                placeContent: 'center',
                gap: 1
            }}
        >
            <CloudOffOutlined sx={{ fontSize: '10rem' }} color="primary" />
            <Typography variant="h4">データがありません</Typography>
            <Typography align="center">
                このサーバーではまだ誰も発言していないようです…<br />
                サーバーで発言してから少し待った後に再度お試しください。
            </Typography>
        </Box>
    </PageContent>
);
