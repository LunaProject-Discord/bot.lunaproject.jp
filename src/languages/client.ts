'use client';

import { parseCookies } from 'nookies';
import { COOKIE_LANGUAGE } from '../utils/cookie';
import { getTranslationByName, LanguageType } from './index';

export const useLanguage = (): LanguageType => {
    const cookies = parseCookies();
    return cookies[COOKIE_LANGUAGE] as LanguageType | undefined ?? 'ja';
};

export const useTranslation = () => getTranslationByName(useLanguage());
