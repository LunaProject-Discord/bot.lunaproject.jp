import { LocaleType } from '@/interfaces/localization';
import { COOKIE_LOCALE } from '@/utils/cookie';
import { cookies } from 'next/headers';
import { getLocalizationByName, getTranslationByName } from './index';

export const getLocale = (): LocaleType => {
    const nextCookies = cookies();
    return nextCookies.get(COOKIE_LOCALE)?.value as LocaleType | undefined ?? 'ja';
};

export const getLocalization = () => getLocalizationByName(getLocale());

export const getTranslation = () => getTranslationByName(getLocale());
