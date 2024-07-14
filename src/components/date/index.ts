import { SectionCardDisabledProps, SectionCardVariableProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { PickerValidDate } from '@mui/x-date-pickers';
import { BaseTimeValidationProps } from '@mui/x-date-pickers/internals/models/validation';

export interface BaseDateTimeEditorProps<TDate extends PickerValidDate, TValue = TDate> extends SectionCardVariableProps<{
    value: TValue;
}>, SectionCardDisabledProps, BaseTimeValidationProps {
    minDate?: TDate;
    maxDate?: TDate;
}

export * from './date_time_editor';
export * from './localization_provider';
export * from './picker_modal_dialog';
