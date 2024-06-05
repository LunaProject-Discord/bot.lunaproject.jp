'use client';

import {
    sectionLevelCardClasses,
    SectionLevelCardProfile,
    SectionLevelCardRank,
    sectionLevelCardRootStyled,
    SectionLevelCardStatus
} from '@/components/section_card';
import { GuildLevel, PartialGuildLevel } from '@/interfaces/bot';
import { GuildViewProps } from '@/interfaces/view';
import { getMaxExperience, MAX_LEVEL_AND_EXPERIENCE } from '@/utils/level';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import {
    SectionAccordionCard,
    SectionAccordionCardHeaderIcon,
    SectionAccordionCardRootProps,
    SectionButtonCardRoot,
    SectionCard,
    SectionCardProps,
    SectionCardVariantProps,
    SectionNumberFieldCard
} from '@lunaproject/web-core/dist/components/SectionCard';
import { ConfigContext, generateComponentClasses, getStateActionValue } from '@lunaproject/web-core/dist/utils';
import { ButtonBaseProps, styled } from '@mui/material';
import { BoxTypeMap } from '@mui/system';
import clsx from 'clsx';
import deepmerge from 'deepmerge';
import React, { Dispatch, ElementType, SetStateAction, useCallback, useContext, useState } from 'react';

export const sectionLevelEditCardClasses = generateComponentClasses(
    'SectionLevelEditCard',
    [
        'root',
        'icon'
    ]
);

export const SectionLevelEditCardRoot = styled(
    ({ className, ...props }: ButtonBaseProps) => (
        <SectionButtonCardRoot
            className={
                clsx(
                    sectionLevelCardClasses.root,
                    sectionLevelEditCardClasses.root,
                    className
                )
            }
            {...props}
        />
    )
)<ButtonBaseProps & SectionCardVariantProps>(({ theme }) => deepmerge(
    sectionLevelCardRootStyled(theme),
    {
        gridTemplateColumns: '32px 40px 1fr 24px',
        [`& .${sectionLevelEditCardClasses.icon}`]: {
            gridColumn: 4,
            gridRow: 'span 2'
        },
        [theme.breakpoints.up('md')]: {
            gridTemplateColumns: '32px 40px 1fr 10% 10% 24px',
            [`& .${sectionLevelEditCardClasses.icon}:not(#_)`]: {
                gridColumn: 6,
                gridRow: 1
            }
        }
    }
));

export interface SectionLevelEditCardRootProps extends GuildViewProps {
    value: GuildLevel;
    setValue: Dispatch<SetStateAction<PartialGuildLevel>>;
}

export type SectionLevelEditCardProps<C extends ElementType = BoxTypeMap['defaultComponent']> =
    & Pick<SectionCardProps<C>, 'disabled' | 'variant' | 'className' | 'sx'>
    & Pick<SectionAccordionCardRootProps, 'defaultExpanded' | 'readOnly'>
    & SectionLevelEditCardRootProps;

export const SectionLevelEditCard = (
    {
        value: { user, member, rank, level, experience },
        setValue,
        guild,
        defaultExpanded: _defaultExpanded,
        disabled: _disabled,
        readOnly: _readOnly,
        variant: _variant,
        localization,
        ...props
    }: SectionLevelEditCardProps
) => {
    const { translations } = localization;

    const config = useContext(ConfigContext);
    const {
        disabled: configRootDisabled,
        variant: configRootVariant
    } = config.components?.SectionCard ?? {};
    const {
        defaultExpanded: configDefaultExpanded,
        disabled: configDisabled,
        readOnly: configReadOnly,
        variant: configVariant
    } = config.components?.SectionAccordionCard ?? {};
    const ExpandMore = config.icons.ExpandMore;

    const defaultExpanded = _defaultExpanded ?? configDefaultExpanded;
    const disabled = _disabled ?? configDisabled ?? configRootDisabled;
    const readOnly = _readOnly ?? configReadOnly;
    const variant = _variant ?? configVariant ?? configRootVariant;

    const [expanded, setExpanded] = useState(Boolean(defaultExpanded));

    const maxExperience = getMaxExperience(level);

    const setLevel = useCallback((action: SetStateAction<number>) => {
        const newLevel = getStateActionValue(action, level);
        const newExperience = Math.min(getMaxExperience(newLevel), experience);

        setValue({ user_id: user.id, level: newLevel, experience: newExperience });
    }, [level, experience, setValue, user.id]);

    const setExperience = useCallback((action: SetStateAction<number>) => setValue({
        user_id: user.id,
        level,
        experience: getStateActionValue(action, experience)
    }), [level, experience, setValue, user.id]);

    return (
        <SectionAccordionCard
            header={
                <SectionLevelEditCardRoot onClick={() => setExpanded(!expanded)} disabled={disabled} variant={variant}>
                    <SectionLevelCardRank rank={rank} />
                    <SectionLevelCardProfile user={user} member={member} guild={guild} />
                    <SectionLevelCardStatus level={level} experience={experience} localization={localization} />
                    <SectionAccordionCardHeaderIcon className={sectionLevelEditCardClasses.icon}>
                        <ExpandMore color={!disabled ? 'action' : 'disabled'} />
                    </SectionAccordionCardHeaderIcon>
                </SectionLevelEditCardRoot>
            }
            expanded={expanded}
            setExpanded={setExpanded}
            defaultExpanded={defaultExpanded}
            disabled={disabled}
            readOnly={readOnly}
            variant={variant}
            slotProps={{
                items: {
                    unmountOnExit: true
                }
            }}
            {...props}
        >
            <SectionNumberFieldCard
                primary={translations.level}
                value={level}
                setValue={setLevel}
                slotProps={{
                    control: {
                        min: 0,
                        max: MAX_LEVEL_AND_EXPERIENCE
                    }
                }}
            />
            <SectionNumberFieldCard
                primary={translations.experience}
                value={experience}
                setValue={setExperience}
                slotProps={{
                    control: {
                        min: 0,
                        max: Math.min(maxExperience, MAX_LEVEL_AND_EXPERIENCE)
                    }
                }}
            />
            <SectionCard primary="レベルと経験値を 0 にする">
                <Button
                    onClick={() => setValue({ user_id: user.id, level: 0, experience: 0 })}
                    variant="outlined"
                    corners="extended"
                >
                    {translations.reset}
                </Button>
            </SectionCard>
        </SectionAccordionCard>
    );
};
