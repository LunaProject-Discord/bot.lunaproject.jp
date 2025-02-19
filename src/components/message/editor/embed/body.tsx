'use client';

import { LocalizationProps } from '@/interfaces/localization';
import { isValidHexColor } from '@/utils/color';
import { useTheme } from '@emotion/react';
import { Box, ButtonBase, OutlinedInput, Popover } from '@mui/material';
import Color, { ColorInstance } from 'color';
import React, { MouseEvent, useState } from 'react';
import { ChromePicker } from 'react-color';
import { ItemDisabledProps, ItemVariableProps } from '../../../items';
import { TextArea } from '../../text_area';
import { EmbedAccordion, EmbedAccordionDetails, EmbedAccordionSummary } from './accordion';
import { EmbedFormContainer, EmbedFormItem } from './form';

export interface EmbedBody {
    color: ColorInstance;
    title: string;
    description: string;
    url: string;
}

type Props = ItemDisabledProps & ItemVariableProps<EmbedBody> & LocalizationProps;

export const EmbedBodyEditor = ({ value, setValue, disabled, localization: { translations } }: Props) => {
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const color = value.color.rgbNumber() === 0xffffff ? undefined : value.color.hex();

    const setColor = (hex: string) => {
        if (isValidHexColor(hex) || hex.length === 0)
            setValue({ ...value, color: Color(hex) });
    };

    return (
        <EmbedAccordion>
            <EmbedAccordionSummary>{translations.embed_body}</EmbedAccordionSummary>
            <EmbedAccordionDetails>
                <EmbedFormContainer>
                    <EmbedFormItem label={translations.embed_body_title} length={value.title.length} maxLength={256}>
                        <OutlinedInput
                            value={value.title}
                            onChange={(e) => setValue({ ...value, title: e.target.value })}
                            type="text"
                            inputProps={{ maxLength: 256 }}
                            disabled={disabled}
                            size="small"
                            margin="none"
                            fullWidth
                        />
                    </EmbedFormItem>
                    <EmbedFormItem label={translations.embed_body_description}>
                        <TextArea
                            value={value.description}
                            setValue={(description) => setValue({ ...value, description })}
                            limit={4096}
                            rows={5}
                        />
                    </EmbedFormItem>
                    <EmbedFormItem label={translations.embed_body_url} inline>
                        <OutlinedInput
                            value={value.url}
                            onChange={(e) => setValue({ ...value, url: e.target.value })}
                            type="url"
                            disabled={disabled}
                            size="small"
                            margin="none"
                            fullWidth
                        />
                    </EmbedFormItem>
                    <EmbedFormItem label={translations.embed_body_color} inline sx={{ flexGrow: 0 }}>
                        <Popover
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            slotProps={{
                                paper: {
                                    sx: (theme) => ({
                                        border: `solid 1px ${theme.vars.palette.divider}`,
                                        boxShadow: `0 ${theme.spacing(.5)} ${theme.spacing(1)} rgb(0 0 0 / .15)`
                                    })
                                }
                            }}
                            sx={{ zIndex: 1600 }}
                        >
                            <ChromePicker
                                color={value.color.hex()}
                                onChange={(result) => setColor(result.hex)}
                            />
                        </Popover>
                        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ButtonBase
                                onClick={handleClick}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    flexShrink: 0,
                                    border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
                                    borderRadius: 1
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        bgcolor: color || theme.palette.background.tertiary,
                                        borderRadius: 1
                                    }}
                                />
                            </ButtonBase>
                            <OutlinedInput
                                value={value.color.hex()}
                                onChange={(e) => setColor(e.target.value)}
                                type="text"
                                disabled={disabled}
                                size="small"
                                margin="none"
                            />
                        </Box>
                    </EmbedFormItem>
                </EmbedFormContainer>
            </EmbedAccordionDetails>
        </EmbedAccordion>
    );
};
