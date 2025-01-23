'use client';

import { AddIcon } from '@/components/icons';
import { SaveConfirmV2 } from '@/components/save_confirm_v2';
import { SectionCategories } from '@/components/section';
import { Category } from '@/components/section_card';
import {
    GuildWebCategory,
    ReplaceGuildWebCategories,
    ReplaceGuildWebCategoriesCreate,
    ReplaceGuildWebCategoriesUpdate
} from '@/interfaces/bot';
import { GuildViewProps } from '@/interfaces/view';
import { ReplaceGuildWebCategoriesSchema } from '@/schemas/bot';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import { PageHeader } from '@lunaproject/web-core/dist/components/Layout';
import { useResettableState } from '@lunaproject/web-core/dist/utils';
import { hexToHsva, hsvaToHexa } from '@uiw/react-color';
import React, { Fragment, useCallback, useMemo } from 'react';

const saveGuildWebCategories = (id: string, data: ReplaceGuildWebCategories) => fetch(
    `/api/guilds/${id}/web/categories`,
    {
        method: 'PUT',
        body: JSON.stringify(data),
        credentials: 'include'
    }
);

interface ViewProps extends GuildViewProps {
    categories: GuildWebCategory[];
}

export const View = ({ guild, categories, localization }: ViewProps) => {
    const { translations } = localization;

    const initialValues = useMemo(() => categories.map((category): Category => ({
        id: category.id,
        slug: category.slug || '',
        color: hexToHsva(category.color || '#00000000'),
        name: category.name,
        description: category.description,
        parentId: category.parent?.id ?? null,
        deleted: false
    })).toSorted((a, b) => a.name.localeCompare(b.name)), [categories]);
    const [values, setValues, resetValues] = useResettableState(initialValues);

    const toSourceObject = useCallback((): ReplaceGuildWebCategories => initialValues.map((initialValue) => {
        let category: ReplaceGuildWebCategoriesUpdate = {
            id: initialValue.id
        };

        const value = values.find((value) => value.id === category.id);
        if (initialValue.slug !== value?.slug)
            category.slug = initialValue.slug;
        if (hsvaToHexa(initialValue.color) !== (value?.color ? hsvaToHexa(value.color) : undefined))
            category.color = hsvaToHexa(initialValue.color);
        if (initialValue.name !== value?.name)
            category.name = initialValue.name;
        if (initialValue.description !== value?.description)
            category.description = initialValue.description;
        if (initialValue.parentId !== value?.parentId)
            category.parentId = initialValue.parentId;

        return category;
    }).toSorted((a, b) => a.id.localeCompare(b.id)), [initialValues, values]);

    const toTargetObject = useCallback((): ReplaceGuildWebCategories => {
        const notDeletedValues = values.filter((value) => !value.deleted);
        const updateCategories = notDeletedValues.filter((value) => categories.some((category) => category.id === value.id));
        const createCategories = notDeletedValues.filter((value) => !categories.some((category) => category.id === value.id));

        return [
            ...updateCategories.map((updateCategory): ReplaceGuildWebCategoriesUpdate => {
                let category: ReplaceGuildWebCategoriesUpdate = {
                    id: updateCategory.id
                };

                const initialValue = initialValues.find((initialValue) => initialValue.id === category.id);
                if (updateCategory.slug !== initialValue?.slug)
                    category.slug = updateCategory.slug;
                if (hsvaToHexa(updateCategory.color) !== (initialValue?.color ? hsvaToHexa(initialValue.color) : undefined))
                    category.color = hsvaToHexa(updateCategory.color);
                if (updateCategory.name !== initialValue?.name)
                    category.name = updateCategory.name;
                if (updateCategory.description !== initialValue?.description)
                    category.description = updateCategory.description;
                if (updateCategory.parentId !== initialValue?.parentId)
                    category.parentId = updateCategory.parentId;

                return category;
            }).toSorted((a, b) => a.id.localeCompare(b.id)),
            ...createCategories.map((createCategory): ReplaceGuildWebCategoriesCreate => ({
                slug: createCategory.slug,
                color: hsvaToHexa(createCategory.color),
                name: createCategory.name,
                description: createCategory.description,
                parentId: createCategory.parentId ?? undefined
            }))
        ];
    }, [categories, initialValues, values]);

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
        const response = await saveGuildWebCategories(guild.id, toTargetObject());
        if (!response.ok)
            return false;

        const categories: GuildWebCategory[] = await response.json();
        setValues(
            categories.map((category): Category => ({
                id: category.id,
                slug: category.slug || '',
                color: hexToHsva(category.color || '#00000000'),
                name: category.name,
                description: category.description,
                parentId: category.parent?.id ?? null,
                deleted: false
            })).toSorted((a, b) => a.name.localeCompare(b.name))
        );

        return true;
    };

    const handleCancelAction = () => resetValues();

    return (
        <Fragment>
            <PageHeader primary={translations.categories} secondary={translations.web_categories_description}>
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
            <SectionCategories
                values={values}
                setValues={setValues}
                categories={categories}
                localization={localization}
            />

            <SaveConfirmV2
                source={toSourceObject()}
                target={toTargetObject()}
                schema={ReplaceGuildWebCategoriesSchema}
                embeddedObjectKeyMapping={{ '.': 'id' }}
                onSave={handleSaveAction}
                onCancel={handleCancelAction}
                localization={localization}
            />
        </Fragment>
    );
};
