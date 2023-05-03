'use client';

import { parseCookies } from 'nookies';
import { LocaleType } from '../interfaces/localization';
import { COOKIE_LOCALE } from '../utils/cookie';
import { getLocalizationByName, getTranslationByName } from './index';

export const useLocale = (): LocaleType => {
    const cookies = parseCookies();
    return cookies[COOKIE_LOCALE] as LocaleType | undefined ?? 'ja';
};

export const useLocalization = () => getLocalizationByName(useLocale());

export const useTranslation = () => getTranslationByName(useLocale());
