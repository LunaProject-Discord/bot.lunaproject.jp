import { LocaleType } from '@/interfaces/localization';
import { COOKIE_LOCALE } from '@/utils/cookie';
import { cookies } from 'next/headers';
import { getLocalizationByName, getTranslationByName } from './index';

export const getLocale = async (): Promise<LocaleType> => {
    const nextCookies = await cookies();
    return nextCookies.get(COOKIE_LOCALE)?.value as LocaleType | undefined ?? 'ja';
};

export const getLocalization = async () => getLocalizationByName(await getLocale());

export const getTranslation = async () => getTranslationByName(await getLocale());
