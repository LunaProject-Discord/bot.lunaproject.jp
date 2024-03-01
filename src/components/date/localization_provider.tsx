'use client';

import { useLocale } from '@/localizations/client';
import { LocalizationProvider, LocalizationProviderProps } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enUS, ja } from 'date-fns/locale';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
    dateFormats?: LocalizationProviderProps<Date, typeof ja>['dateFormats'];
}

export const DateLocalizationProvider = ({ children, dateFormats }: Props) => {
    const language = useLocale();

    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={language === 'ja' ? ja : enUS}
            dateFormats={{
                year: language === 'ja' ? 'yyyy年' : 'yyyy',
                monthAndDate: language === 'ja' ? 'M月d日' : 'MMM d',
                monthAndYear: language === 'ja' ? 'yyyy年M月' : 'MMM yyyy',
                fullDate: language === 'ja' ? 'yyyy年M月d日' : 'MMM d, yyyy',
                shortDate: language === 'ja' ? 'M月d日' : 'MMM d',
                ...dateFormats
            }}
        >
            {children}
        </LocalizationProvider>
    );
};
