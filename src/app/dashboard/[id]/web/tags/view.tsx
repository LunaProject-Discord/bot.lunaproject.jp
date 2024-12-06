'use client';

import { AddIcon } from '@/components/icons';
import { SaveConfirmV2 } from '@/components/save_confirm_v2';
import { SectionTags } from '@/components/section';
import { Tag } from '@/components/section_card';
import {
    GuildWebTag,
    ReplaceGuildWebTags,
    ReplaceGuildWebTagsCreate,
    ReplaceGuildWebTagsUpdate
} from '@/interfaces/bot';
import { GuildViewProps } from '@/interfaces/view';
import { ReplaceGuildWebTagsSchema } from '@/schemas/bot';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import { PageHeader } from '@lunaproject/web-core/dist/components/Layout';
import { hexToHsva, hsvaToHexa } from '@uiw/react-color';
import sortBy from 'lodash/sortBy';
import React, { Fragment, useCallback, useMemo, useState } from 'react';

const saveGuildWebTags = (id: string, data: ReplaceGuildWebTags) => fetch(
    `/api/guilds/${id}/web/tags`,
    {
        method: 'PUT',
        body: JSON.stringify(data),
        credentials: 'include'
    }
);

interface ViewProps extends GuildViewProps {
    tags: GuildWebTag[];
}

export const View = ({ guild, tags, localization }: ViewProps) => {
    const { translations } = localization;

    const initialValues = useMemo(() => sortBy(
        tags.map((tag): Tag => ({
            id: tag.id,
            slug: tag.slug || '',
            color: hexToHsva(tag.color || '#00000000'),
            name: tag.name,
            description: tag.description,
            deleted: false
        })),
        'name'
    ), [tags]);
    const [values, setValues] = useState(initialValues);
    const resetValues = () => setValues(initialValues);

    const toSourceObject = useCallback((): ReplaceGuildWebTags => sortBy(
        initialValues.map((initialValue) => {
            let tag: ReplaceGuildWebTagsUpdate = {
                id: initialValue.id
            };

            const value = values.find((value) => value.id === tag.id);
            if (initialValue.slug !== value?.slug)
                tag.slug = initialValue.slug;
            if (hsvaToHexa(initialValue.color) !== (value?.color ? hsvaToHexa(value.color) : undefined))
                tag.color = hsvaToHexa(initialValue.color);
            if (initialValue.name !== value?.name)
                tag.name = initialValue.name;
            if (initialValue.description !== value?.description)
                tag.description = initialValue.description;

            return tag;
        }),
        'id'
    ), [initialValues, values]);

    const toTargetObject = useCallback((): ReplaceGuildWebTags => {
        const notDeletedValues = values.filter((value) => !value.deleted);
        const updateTags = notDeletedValues.filter((value) => tags.some((tag) => tag.id === value.id));
        const createTags = notDeletedValues.filter((value) => !tags.some((tag) => tag.id === value.id));

        return [
            ...sortBy(
                updateTags.map((updateTag): ReplaceGuildWebTagsUpdate => {
                    let tag: ReplaceGuildWebTagsUpdate = {
                        id: updateTag.id
                    };

                    const initialValue = initialValues.find((initialValue) => initialValue.id === tag.id);
                    if (updateTag.slug !== initialValue?.slug)
                        tag.slug = updateTag.slug;
                    if (hsvaToHexa(updateTag.color) !== (initialValue?.color ? hsvaToHexa(initialValue.color) : undefined))
                        tag.color = hsvaToHexa(updateTag.color);
                    if (updateTag.name !== initialValue?.name)
                        tag.name = updateTag.name;
                    if (updateTag.description !== initialValue?.description)
                        tag.description = updateTag.description;

                    return tag;
                }),
                'id'
            ),
            ...createTags.map((createTag): ReplaceGuildWebTagsCreate => ({
                slug: createTag.slug,
                color: hsvaToHexa(createTag.color),
                name: createTag.name,
                description: createTag.description
            }))
        ];
    }, [tags, initialValues, values]);

    const handleAddButtonClick = () => setValues((prevValues) => [
        ...prevValues,
        {
            id: new Date().getTime().toString(),
            slug: '',
            color: hexToHsva('#00000000'),
            name: '',
            description: '',
            parentId: null,
            deleted: false,
            _defaultExpanded: true
        }
    ]);

    const handleSaveAction = async () => {
        const response = await saveGuildWebTags(guild.id, toTargetObject());
        if (!response.ok)
            return false;

        const tags: GuildWebTag[] = await response.json();
        setValues(
            sortBy(
                tags.map((tag): Tag => ({
                    id: tag.id,
                    slug: tag.slug || '',
                    color: hexToHsva(tag.color || '#00000000'),
                    name: tag.name,
                    description: tag.description,
                    deleted: false
                })),
                'name'
            )
        );

        return true;
    };

    const handleCancelAction = () => resetValues();

    return (
        <Fragment>
            <PageHeader primary={translations.web_tags} secondary={translations.web_tags_description}>
                <Button
                    onClick={handleAddButtonClick}
                    disableElevation
                    variant="contained"
                    corners="extended"
                    size="large"
                    fullWidth
                    startIcon={<AddIcon />}
                    sx={{ ml: { md: 'auto' } }}
                >
                    {translations.add}
                </Button>
            </PageHeader>
            <SectionTags
                values={values}
                setValues={setValues}
                tags={tags}
                localization={localization}
            />

            <SaveConfirmV2
                source={toSourceObject()}
                target={toTargetObject()}
                schema={ReplaceGuildWebTagsSchema}
                embeddedObjectKeyMapping={{ '.': 'id' }}
                onSave={handleSaveAction}
                onCancel={handleCancelAction}
                localization={localization}
            />
        </Fragment>
    );
};
