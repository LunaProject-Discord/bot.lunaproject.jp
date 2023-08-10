import { Localization, Translations } from '@interfaces/localization';
import { enUS as muiEnUS, jaJP as muiJaJP } from '@mui/material/locale';
import { enUS as muiGridEnUS, jaJP as muiGridJaJP } from '@mui/x-data-grid/locales';
import { enUS as muiDateEnUS, jaJP as muiDateJaJP } from '@mui/x-date-pickers/locales';
import { enUS as dateFnsEnUS, ja as dateFnsJa } from 'date-fns/locale';
import { localizationEn, translationsEn } from './translations/en';
import { localizationJa, translationsJa } from './translations/ja';

export const getLocalizationByName = (language: string | undefined): Localization => {
    switch (language) {
        case 'en':
            return localizationEn;
        default:
            return localizationJa;
    }
};

export const getTranslationByName = (language: string | undefined): Translations => {
    switch (language) {
        case 'en':
            return translationsEn;
        default:
            return translationsJa;
    }
};

export const getDateFnsLocaleByName = (language: string | undefined) => {
    switch (language) {
        case 'en':
            return dateFnsEnUS;
        default:
            return dateFnsJa;
    }
};

export const getMuiLocalizationByName = (language: string | undefined) => {
    switch (language) {
        case 'en':
            return muiEnUS;
        default:
            return muiJaJP;
    }
};

export const getMuiDateLocalizationByName = (language: string | undefined) => {
    switch (language) {
        case 'en':
            return muiDateEnUS;
        default:
            return muiDateJaJP;
    }
};

export const getMuiGridLocalizationByName = (language: string | undefined) => {
    switch (language) {
        case 'en':
            return muiGridEnUS;
        default:
            return muiGridJaJP;
    }
};
