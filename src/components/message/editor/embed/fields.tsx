'use client';

import type { EmbedField } from '@lunaproject-discord/web-discord/dist/interfaces/message';
import { DefaultField } from '@lunaproject-discord/web-discord/dist/interfaces/message';
import {
    AddOutlined,
    ClearOutlined,
    ContentCopyOutlined,
    KeyboardArrowDownOutlined,
    KeyboardArrowUpOutlined
} from '@mui/icons-material';
import { Box, Button, Checkbox, FormControlLabel, IconButton, OutlinedInput, Tooltip } from '@mui/material';
import { nanoid } from 'nanoid';
import React, { MouseEvent } from 'react';
import { LocalizationProps } from '../../../../interfaces/localization';
import { ItemDisabledProps, ItemVariableProps } from '../../../items';
import { TextArea } from '../../text_area';
import { EmbedAccordion, EmbedAccordionDetails, EmbedAccordionSummary } from './accordion';
import { EmbedFormContainer, EmbedFormItem } from './form';

interface EmbedFieldEditorProps extends ItemDisabledProps, ItemVariableProps<EmbedField>, LocalizationProps {
    index: number;
    remove: (e: MouseEvent<HTMLButtonElement>) => void;
    visibleMoveUpButton: boolean;
    visibleMoveDownButton: boolean;
    moveUp: (e: MouseEvent<HTMLButtonElement>) => void;
    moveDown: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const EmbedFieldEditor = (
    {
        index,
        value,
        setValue,
        disabled,
        remove,
        visibleMoveUpButton,
        visibleMoveDownButton,
        moveUp,
        moveDown,
        localization: { translations }
    }: EmbedFieldEditorProps
) => (
    <EmbedAccordion sx={{ pr: 0 }}>
        <EmbedAccordionSummary>
            {translations.embed_field} #{index + 1}{value.name && ` — ${value.name}`}
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: .5 }}>
                {visibleMoveUpButton && <Tooltip title={translations.move_up} placement="top">
                    <IconButton onClick={moveUp} size="small" sx={{ width: 36, height: 36 }}>
                        <KeyboardArrowUpOutlined />
                    </IconButton>
                </Tooltip>}
                {visibleMoveDownButton && <Tooltip title={translations.move_down} placement="top">
                    <IconButton onClick={moveDown} size="small" sx={{ width: 36, height: 36 }}>
                        <KeyboardArrowDownOutlined />
                    </IconButton>
                </Tooltip>}
                <IconButton size="small" sx={{ width: 36, height: 36 }}>
                    <ContentCopyOutlined fontSize="small" />
                </IconButton>
                <Tooltip title={translations.remove} placement="top">
                    <IconButton onClick={remove} size="small" color="error" sx={{ width: 36, height: 36 }}>
                        <ClearOutlined fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </EmbedAccordionSummary>
        <EmbedAccordionDetails>
            <EmbedFormContainer sx={{ pr: 0 }}>
                <EmbedFormItem label={translations.embed_field_name} inline length={value.name.length} maxLength={256}>
                    <OutlinedInput
                        value={value.name}
                        onChange={(e) => setValue({ ...value, name: e.target.value })}
                        type="text"
                        inputProps={{ maxLength: 256 }}
                        disabled={disabled}
                        fullWidth
                        size="small"
                        margin="none"
                    />
                </EmbedFormItem>
                <EmbedFormItem label="&nbsp;" inline sx={{ flexGrow: 0 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={value.inline}
                                onChange={() => setValue({ ...value, inline: !value.inline })}
                                disabled={disabled}
                            />
                        }
                        label={translations.embed_field_inline}
                        disabled={disabled}
                        sx={{ m: 0 }}
                    />
                </EmbedFormItem>
                <EmbedFormItem label={translations.embed_field_value}>
                    <TextArea
                        value={value.value}
                        setValue={(text) => setValue({ ...value, value: text })}
                        limit={1024}
                        rows={5}
                    />
                </EmbedFormItem>
            </EmbedFormContainer>
        </EmbedAccordionDetails>
    </EmbedAccordion>
);

type EmbedFieldsEditorProps = ItemDisabledProps & ItemVariableProps<EmbedField[]> & LocalizationProps;

export const EmbedFieldsEditor = ({ value, setValue, disabled, localization }: EmbedFieldsEditorProps) => {
    const { translations } = localization;

    const add = () => setValue([...value, { _id: nanoid(), ...DefaultField }]);

    const remove = (i: number) => {
        const data = [...value];
        data.splice(i, 1);
        setValue(data);
    };

    const edit = (i: number, field: EmbedField) => {
        const data = [...value];
        data[i] = field;
        setValue(data);
    };

    const moveUp = (i: number) => {
        if (i === 0) return;

        const data = [...value];
        data.splice(i - 1, 0, ...data.splice(i, 1));
        setValue(data);
    };

    const moveDown = (i: number) => {
        if (i === value.length - 1) return;

        const data = [...value];
        data.splice(i + 1, 0, ...data.splice(i, 1));
        setValue(data);
    };

    return (
        <EmbedAccordion>
            <EmbedAccordionSummary>{translations.embed_fields}</EmbedAccordionSummary>
            <EmbedAccordionDetails>
                <EmbedFormContainer sx={{ pl: 2, display: 'block' }}>
                    {value.map((field, i) => (
                        <EmbedFieldEditor
                            key={field._id ?? i}
                            index={i}
                            value={field}
                            setValue={(field) => edit(i, field)}
                            disabled={disabled}
                            remove={(e) => {
                                e.stopPropagation();
                                remove(i);
                            }}
                            visibleMoveUpButton={i !== 0}
                            visibleMoveDownButton={i !== value.length - 1}
                            moveUp={(e) => {
                                e.stopPropagation();
                                moveUp(i);
                            }}
                            moveDown={(e) => {
                                e.stopPropagation();
                                moveDown(i);
                            }}
                            localization={localization}
                        />
                    ))}
                    <Box sx={{ pt: 1, px: 1 }}>
                        <Button
                            onClick={add}
                            disableElevation
                            variant="contained"
                            startIcon={<AddOutlined />}
                        >
                            {translations.embed_field_add}
                        </Button>
                    </Box>
                </EmbedFormContainer>
            </EmbedAccordionDetails>
        </EmbedAccordion>
    );
};
