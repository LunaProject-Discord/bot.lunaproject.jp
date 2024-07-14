'use client';

import { useLocale } from '@/localizations/client';
import { LocalizationProvider, LocalizationProviderProps } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { enUS, ja } from 'date-fns/locale';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
    dateFormats?: LocalizationProviderProps<Date, typeof ja>['dateFormats'];
}

export const DateLocalizationProvider = ({ children, dateFormats }: Props) => {
    const locale = useLocale();

    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={locale === 'ja' ? ja : enUS}
            dateFormats={{
                year: locale === 'ja' ? 'yyyy年' : 'yyyy',
                fullDate: locale === 'ja' ? 'yyyy年M月d日' : 'MMM d, yyyy',
                shortDate: locale === 'ja' ? 'M月d日' : 'MMM d',
                ...dateFormats
            }}
        >
            {children}
        </LocalizationProvider>
    );
};
