'use client';

import { BaseDateTimeEditorProps } from '@/components/date';
import { TodayIcon } from '@/components/icons';
import { useLocale } from '@/localizations/client';
import { Popover } from '@lunaproject/web-core/dist/components/Popover';
import { createTheme, IconButton, InputAdornment, typographyClasses, useMediaQuery } from '@mui/material';
import {
    DateTimeField,
    DateTimeFieldProps,
    dateTimePickerToolbarClasses,
    MobileDateTimePicker,
    PickerValidDate,
    StaticDateTimePicker
} from '@mui/x-date-pickers';
import { BaseDateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker/shared';
import { pickersToolbarTextClasses } from '@mui/x-date-pickers/internals';
import {
    ExportedUseMobilePickerSlotProps
} from '@mui/x-date-pickers/internals/hooks/useMobilePicker/useMobilePicker.types';
import { DateOrTimeView } from '@mui/x-date-pickers/models';
import React, { useState } from 'react';
import { DateLocalizationProvider } from './localization_provider';
import { DatePickerModalDialog } from './picker_modal_dialog';

export interface DateTimeEditorProps<TDate extends PickerValidDate, TValue = TDate> extends BaseDateTimeEditorProps<TDate, TValue> {
    slotProps?: {
        mobileField?: ExportedUseMobilePickerSlotProps<TDate, DateOrTimeView, false>['field'];
        desktopField?: DateTimeFieldProps<TDate>;
        picker?: BaseDateTimePickerProps<TDate, DateOrTimeView>;
    };
}

const defaultTheme = createTheme();

export const DateTimeEditor = (
    {
        value,
        setValue,
        disabled,
        disablePast,
        disableFuture,
        minDate,
        maxDate,
        slotProps: {
            mobileField,
            desktopField,
            picker
        } = {}
    }: DateTimeEditorProps<Date, Date | null>
) => {
    const locale = useLocale();

    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);

    if (isMobile) {
        return (
            <DateLocalizationProvider>
                <MobileDateTimePicker
                    value={value}
                    onChange={(date) => setValue(date)}
                    disabled={disabled}
                    disablePast={disablePast}
                    disableFuture={disableFuture}
                    minDate={minDate}
                    maxDate={maxDate}
                    views={['year', 'month', 'day', 'hours', 'minutes']}
                    slots={{ dialog: DatePickerModalDialog }}
                    slotProps={{
                        actionBar: {
                            actions: ['clear', 'today', 'cancel', 'accept']
                        },
                        calendarHeader: {
                            format: locale === 'ja' ? 'yyyy年M月' : 'MMM yyyy'
                        },
                        field: {
                            disabled,
                            ...mobileField
                        },
                        textField: {
                            size: 'small'
                        },
                        toolbar: {
                            sx: {
                                [`& .${dateTimePickerToolbarClasses.dateContainer} .${pickersToolbarTextClasses.root}.${typographyClasses.h4}`]: {
                                    fontSize: defaultTheme.typography.h4.fontSize,
                                    fontWeight: defaultTheme.typography.h4.fontWeight,
                                    lineHeight: defaultTheme.typography.h4.lineHeight
                                },
                                [`& .${dateTimePickerToolbarClasses.timeDigitsContainer} .${pickersToolbarTextClasses.root}.${typographyClasses.h3}`]: {
                                    fontSize: defaultTheme.typography.h3.fontSize,
                                    fontWeight: defaultTheme.typography.h3.fontWeight,
                                    lineHeight: defaultTheme.typography.h3.lineHeight
                                }
                            }
                        }
                    }}
                    {...picker}
                />
            </DateLocalizationProvider>
        );
    } else {
        return (
            <DateLocalizationProvider>
                <DateTimeField
                    value={value}
                    onChange={(date) => setValue(date)}
                    disabled={disabled}
                    disablePast={disablePast}
                    disableFuture={disableFuture}
                    minDate={minDate}
                    maxDate={maxDate}
                    fullWidth
                    slotProps={{
                        textField: {
                            size: 'small',
                            InputProps: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={(e) => setAnchorEl(e.currentTarget)}
                                            edge="end"
                                            size="small"
                                            sx={{ mr: -1 }}
                                        >
                                            <TodayIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }
                    }}
                    {...desktopField}
                />

                <Popover
                    open={!isMobile && open}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    sx={{ zIndex: 1600 }}
                >
                    <StaticDateTimePicker
                        value={value}
                        onChange={(date) => setValue(date)}
                        disabled={disabled}
                        disablePast={disablePast}
                        disableFuture={disableFuture}
                        minDate={minDate}
                        maxDate={maxDate}
                        views={['year', 'month', 'day', 'hours', 'minutes']}
                        slotProps={{
                            actionBar: {
                                actions: ['clear', 'today']
                            },
                            calendarHeader: {
                                format: locale === 'ja' ? 'yyyy年M月' : 'MMM yyyy'
                            },
                            toolbar: {
                                sx: {
                                    [`& .${dateTimePickerToolbarClasses.dateContainer} .${pickersToolbarTextClasses.root}.${typographyClasses.h4}`]: {
                                        fontSize: defaultTheme.typography.h4.fontSize,
                                        fontWeight: defaultTheme.typography.h4.fontWeight,
                                        lineHeight: defaultTheme.typography.h4.lineHeight
                                    },
                                    [`& .${dateTimePickerToolbarClasses.timeDigitsContainer} .${pickersToolbarTextClasses.root}.${typographyClasses.h3}`]: {
                                        fontSize: defaultTheme.typography.h3.fontSize,
                                        fontWeight: defaultTheme.typography.h3.fontWeight,
                                        lineHeight: defaultTheme.typography.h3.lineHeight
                                    }
                                }
                            }
                        }}
                        {...picker}
                    />
                </Popover>
            </DateLocalizationProvider>
        );
    }
};
