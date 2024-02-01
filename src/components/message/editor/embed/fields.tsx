'use client';

import { AddIcon, CloseIcon, ContentCopyIcon, KeyboardArrowDownIcon, KeyboardArrowUpIcon } from '@components/icons';
import { LocalizationProps } from '@interfaces/localization';
import { DefaultField, EmbedField } from '@lunaproject/web-discord/dist/interfaces';
import { Box, Button, Checkbox, FormControlLabel, IconButton, OutlinedInput, Tooltip } from '@mui/material';
import {
    moveDown as moveDownArray,
    moveUp as moveUpArray,
    remove as removeArray,
    replace as replaceArray
} from '@utils/array';
import { getStateActionValue } from '@utils/react/state';
import { nanoid } from 'nanoid';
import React, { MouseEvent } from 'react';
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
    duplicate: (e: MouseEvent<HTMLButtonElement>) => void;
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
        duplicate,
        localization: { translations }
    }: EmbedFieldEditorProps
) => (
    <EmbedAccordion sx={{ pr: 0 }}>
        <EmbedAccordionSummary>
            {translations.embed_field} #{index + 1}{value.name && ` — ${value.name}`}
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: .5 }}>
                {visibleMoveUpButton && <Tooltip title={translations.move_up}>
                    <IconButton onClick={moveUp} size="small" sx={{ width: 36, height: 36 }}>
                        <KeyboardArrowUpIcon />
                    </IconButton>
                </Tooltip>}
                {visibleMoveDownButton && <Tooltip title={translations.move_down}>
                    <IconButton onClick={moveDown} size="small" sx={{ width: 36, height: 36 }}>
                        <KeyboardArrowDownIcon />
                    </IconButton>
                </Tooltip>}
                <Tooltip title={translations.duplicate}>
                    <IconButton onClick={duplicate} size="small" sx={{ width: 36, height: 36 }}>
                        <ContentCopyIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title={translations.remove}>
                    <IconButton onClick={remove} color="error" size="small" sx={{ width: 36, height: 36 }}>
                        <CloseIcon fontSize="small" />
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
                        size="small"
                        margin="none"
                        fullWidth
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

    const add = () => setValue((prevValue) => [...prevValue, { _id: nanoid(), ...DefaultField }]);

    const remove = (i: number) => setValue((prevValue) => removeArray(prevValue, i));

    const update = (i: number, field: EmbedField) => setValue((prevValue) => replaceArray(prevValue, i, field));

    const moveUp = (i: number) => setValue((prevValue) => moveUpArray(prevValue, i));

    const moveDown = (i: number) => setValue((prevValue) => moveDownArray(prevValue, i));

    const duplicate = (i: number, mode: 'next' | 'last') => setValue((prevValue) => {
        const field = prevValue[i];
        return replaceArray(prevValue, mode === 'next' ? i + 1 : prevValue.length, { ...field, _id: nanoid() }, 0);
    });

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
                            setValue={(action) => update(i, getStateActionValue(action, field))}
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
                            duplicate={(e) => {
                                e.stopPropagation();
                                duplicate(i, e.shiftKey ? 'last' : 'next');
                            }}
                            localization={localization}
                        />
                    ))}
                    <Box sx={{ pt: 1, px: 1 }}>
                        <Button
                            onClick={add}
                            disabled={disabled || value.length > 24}
                            disableElevation
                            variant="contained"
                            startIcon={<AddIcon />}
                        >
                            {translations.embed_field_add}
                        </Button>
                    </Box>
                </EmbedFormContainer>
            </EmbedAccordionDetails>
        </EmbedAccordion>
    );
};
