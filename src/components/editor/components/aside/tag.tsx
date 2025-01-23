'use client';

import { EditorSelectButton, EditorSelectButtonContent, EditorSelectButtonLabel } from '@/components/editor';
import { ColorPickerPreview, TagPicker, TagPickerType } from '@/components/picker';
import { Tag } from '@/components/section_card';
import { GuildWebTag } from '@/interfaces/bot';
import { LocalizationProps } from '@/interfaces/localization';
import { SectionCardDisabledProps, SectionCardVariableProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { alpha, Box, Chip, chipClasses, Typography, useTheme } from '@mui/material';
import { hexToHsva } from '@uiw/react-color';
import xor from 'lodash/xor';
import { size } from 'polished';
import React, { Fragment, MouseEvent, useCallback, useMemo, useState } from 'react';

export interface EditorTagSelectButtonProps extends SectionCardDisabledProps, SectionCardVariableProps<{
    value: string[];
}>, LocalizationProps {
    tags: GuildWebTag[];
}

export const EditorTagSelectButton = (
    {
        value,
        setValue,
        tags,
        disabled,
        localization
    }: EditorTagSelectButtonProps
) => {
    const { translations } = localization;

    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined);

    const choices = useMemo(() => tags.map((tag): Tag => ({
        id: tag.id,
        slug: tag.slug || '',
        color: hexToHsva(tag.color || '#00000000'),
        name: tag.name,
        description: tag.description,
        deleted: false
    })).toSorted((a, b) => a.name.localeCompare(b.name)), [tags]);

    const handlePickerChoiceClick = useCallback((e: MouseEvent<HTMLDivElement>, tag: TagPickerType) => {
        setValue((prevValue) => xor(prevValue, [tag.id]));

        if (!e.shiftKey)
            setAnchorEl(undefined);
    }, [setValue]);

    return (
        <Fragment>
            <EditorSelectButton onClick={(e) => setAnchorEl(e.currentTarget)} disabled={disabled}>
                <EditorSelectButtonLabel>{translations.tags}</EditorSelectButtonLabel>
                <EditorSelectButtonContent>
                    {tags.filter((tag) => value.includes(tag.id)).map((tag) => {
                        const colorAlpha = hexToHsva(tag.color).a;

                        return (
                            <Chip
                                key={tag.id}
                                icon={
                                    colorAlpha > 0 ? <Box
                                        sx={{
                                            ...size(24),
                                            display: 'flex',
                                            flexShrink: 0,
                                            placeItems: 'center',
                                            placeContent: 'center'
                                        }}
                                    >
                                        <ColorPickerPreview
                                            hsva={hexToHsva(tag.color)}
                                            width={theme.spacing(1.5)}
                                            height={theme.spacing(1.5)}
                                        />
                                    </Box> : undefined
                                }
                                label={tag.name}
                                sx={(theme) => {
                                    if (colorAlpha === 0)
                                        return {};

                                    return {
                                        bgcolor: alpha(tag.color, .12),
                                        ...theme.applyStyles('dark', {
                                            bgcolor: alpha(tag.color, .24)
                                        }),
                                        [`& .${chipClasses.label}`]: {
                                            pl: 1
                                        }
                                    };
                                }}
                            />
                        );
                    })}
                    {value.length === 0 && <Typography>{translations.none}</Typography>}
                </EditorSelectButtonContent>
            </EditorSelectButton>

            <TagPicker
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                choices={choices}
                selected={value}
                onClick={handlePickerChoiceClick}
                slotProps={{
                    desktop: {
                        root: {
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'right'
                            },
                            transformOrigin: {
                                vertical: 'top',
                                horizontal: 'right'
                            }
                        }
                    }
                }}
                localization={localization}
            />
        </Fragment>
    );
};
