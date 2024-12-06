'use client';

import { ErrorDescription, ErrorRoot, ErrorTitle } from '@/components/error';
import { CloudOffIcon } from '@/components/icons';
import { SectionTagCard, Tag } from '@/components/section_card';
import { GuildWebTag } from '@/interfaces/bot';
import { LocalizationProps } from '@/interfaces/localization';
import { Section, SectionContent } from '@lunaproject/web-core/dist/components/Section';
import { SectionCardVariableProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { getStateActionValue, remove as removeArray, replace as replaceArray } from '@lunaproject/web-core/dist/utils';
import { Collapse } from '@mui/material';
import deepEqual from 'deep-equal';
import React, { memo, SetStateAction, useCallback } from 'react';
import { TransitionGroup } from 'react-transition-group';

export interface SectionTagsProps extends SectionCardVariableProps<{ values: Tag[]; }>, LocalizationProps {
    tags: GuildWebTag[];
}

export const SectionTags = memo<SectionTagsProps>((
    {
        values,
        setValues,
        tags,
        localization
    }
) => {
    const { translations } = localization;

    const setValue = useCallback((id: string) => (action: SetStateAction<Tag>) => setValues((values) => {
        const index = values.findIndex((value) => value.id === id);
        if (index === -1)
            return values;

        const { id: _, ...value } = getStateActionValue(action, values[index]);

        if (!Number.isNaN(Number(id)) && value.deleted)
            return removeArray(values, index);

        return replaceArray(
            values,
            index,
            {
                id,
                ...value
            }
        );
    }), [setValues]);

    if (values.length < 1) {
        return (
            <ErrorRoot>
                <CloudOffIcon sx={{ fontSize: '10rem' }} />
                <ErrorTitle>{translations.error_data_not_found_title}</ErrorTitle>
                <ErrorDescription>{translations.error_data_not_found_description}</ErrorDescription>
            </ErrorRoot>
        );
    }

    return (
        <Section>
            <SectionContent>
                <TransitionGroup>
                    {values.map((value) => (
                        <Collapse
                            key={value.id}
                            sx={{
                                '&:not(:last-child)': {
                                    mb: .5
                                }
                            }}
                        >
                            <SectionTagCard
                                value={value}
                                setValue={setValue(value.id)}
                                tag={tags.find((tag) => tag.id === value.id)}
                                localization={localization}
                            />
                        </Collapse>
                    ))}
                </TransitionGroup>
            </SectionContent>
        </Section>
    );
}, (
    { values: oldValues, tags: oldCategories },
    { values: newValues, tags: newCategories }
) => deepEqual(oldValues, newValues, { strict: true }) && deepEqual(oldCategories, newCategories, { strict: true }));
SectionTags.displayName = 'SectionTags';
