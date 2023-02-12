'use client';

import { NumberField, useResettableState } from '@lunaproject-discord/web-core';
import { ClearAllOutlined } from '@mui/icons-material';
import { Avatar, Box, BoxProps, Button, styled, Typography } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { ItemIcon, ItemRowContainer, ItemTextBlock } from '../../../../../components/items';
import { PageContent, PageHeader } from '../../../../../components/layout';
import { SaveConfirm } from '../../../../../components/save_confirm';
import { Section } from '../../../../../components/section';
import { GuildLevel, PartialGuildLevel, PartialUser } from '../../../../../interfaces/bot';
import { GuildSettingsViewProps, TranslatableViewProps } from '../../../../../interfaces/view';
import { StyledToolbar } from '../../navigation';

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

interface LevelItemProps extends TranslatableViewProps {
    user: PartialUser;
    value: PartialGuildLevel;
    setValue: (value: PartialGuildLevel) => void;
}

export const LevelItem = ({ user, value, setValue, translations }: LevelItemProps) => {
    return (
        <ItemContainer>
            <ItemRowContainer>
                <ItemIcon
                    icon={
                        <Avatar
                            src={user.avatar}
                        />
                    }
                />
                <ItemTextBlock
                    primary={user.name}
                    secondary={`#${user.discriminator}`}
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
};

interface Props extends GuildSettingsViewProps {
    levels: GuildLevel[];
}

export const View = ({ guild, levels, translations }: Props) => {
    const [values, setValues, resetValues] = useResettableState<PartialGuildLevel[]>([]);

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

    return (
        <PageContent position="relative">
            <StyledToolbar />
            <PageHeader>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: .5 }}>
                    <Typography variant="h4">{translations.level_manage}</Typography>
                    <Typography variant="body1">{translations.level_description}</Typography>
                </Box>
            </PageHeader>
            <Section sx={{ gap: 1 }}>
                {levels.map((level) => {
                    const data = values.find((value) => value.user_id === level.user.id);
                    return (
                        <LevelItem
                            key={level.user.id}
                            user={level.user}
                            value={data ?? { user_id: level.user.id, level: level.level, xp: level.xp }}
                            setValue={updateValue}
                            translations={translations}
                        />
                    );
                })}
            </Section>
            <SaveConfirm open={values.length > 0} onSave={handleActionSave} onCancel={handleActionCancel} />
        </PageContent>
    );
};
