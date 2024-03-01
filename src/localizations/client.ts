'use client';

import { LocaleType } from '@/interfaces/localization';
import { COOKIE_LOCALE } from '@/utils/cookie';
import { parseCookies } from 'nookies';
import { getLocalizationByName, getTranslationByName } from './index';

export const useLocale = (): LocaleType => {
    const cookies = parseCookies();
    return cookies[COOKIE_LOCALE] as LocaleType | undefined ?? 'ja';
};

export const useLocalization = () => getLocalizationByName(useLocale());

export const useTranslation = () => getTranslationByName(useLocale());
