'use client';

import { Avatar, Box, styled, Typography } from '@mui/material';
import React from 'react';
import { ItemFormContainer, ItemIcon, ItemRowContainer, ItemTextBlock } from '../../../../../components/items';
import { PageContent, PageHeader } from '../../../../../components/layout';
import { NumberField } from '../../../../../components/number_field';
import { SaveConfirm } from '../../../../../components/save_confirm';
import { Section } from '../../../../../components/section';
import { GuildLevel, PartialGuildLevel, PartialUser } from '../../../../../interfaces/bot';
import { GuildSettingsViewProps } from '../../../../../interfaces/view';
import { useResettableState } from '../../../../../utils/state';
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
    gap: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color', 'color'], {
        duration: theme.transitions.duration.shortest
    }),
    [theme.breakpoints.down('md')]: {
        gap: theme.spacing(.5)
    }
}));

interface LevelItemProps {
    user: PartialUser;
    value: PartialGuildLevel;
    setValue: (value: PartialGuildLevel) => void;
}

export const LevelItem = ({ user, value, setValue }: LevelItemProps) => {
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">レベル</Typography>
                    <NumberField
                        value={value.level}
                        setValue={(level) => setValue({ ...value, level })}
                    />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">経験値</Typography>
                    <NumberField
                        value={value.xp}
                        setValue={(xp) => setValue({ ...value, xp })}
                    />
                </Box>
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
                    <Typography variant="h4">{translations.level}</Typography>
                    <Typography variant="body1">{translations.level_description}</Typography>
                </Box>
            </PageHeader>
            <Section>
                {levels.map((level) => {
                    const data = values.find((value) => value.user_id === level.user.id);
                    return (
                        <LevelItem
                            key={level.user.id}
                            user={level.user}
                            value={data ?? { user_id: level.user.id, level: level.level, xp: level.xp }}
                            setValue={updateValue}
                        />
                    );
                })}
            </Section>
            <SaveConfirm open={values.length > 0} onSave={handleActionSave} onCancel={handleActionCancel} />
        </PageContent>
    );
};
