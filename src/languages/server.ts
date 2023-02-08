import { cookies } from 'next/headers';
import { COOKIE_LANGUAGE } from '../utils/cookie';
import { getTranslationByName, LanguageType } from './index';

export const getLanguage = (): LanguageType => {
    const nextCookies = cookies();
    return nextCookies.get(COOKIE_LANGUAGE)?.value as LanguageType | undefined ?? 'ja';
};

export const getTranslation = () => getTranslationByName(getLanguage());
