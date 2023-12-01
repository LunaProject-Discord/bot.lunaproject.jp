import { ItemDisabledProps, ItemVariableProps } from '@lunaproject/web-core/dist/components/SectionItems';
import { BaseTimeValidationProps } from '@mui/x-date-pickers/internals/models/validation';

export interface BaseDateTimeEditorProps<T = Date> extends ItemDisabledProps, ItemVariableProps<T>, BaseTimeValidationProps {
    minDate?: T;
    maxDate?: T;
}

export * from './date_time_editor';
export * from './localization_provider';
export * from './picker_modal_dialog';
