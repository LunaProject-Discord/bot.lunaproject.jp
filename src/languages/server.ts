import { cookies } from 'next/headers';
import { Translation } from '../interfaces/language';
import { getTranslationByName } from './index';

export const getTranslation = (): Translation => {
    const nextCookies = cookies();
    return getTranslationByName(nextCookies.get('language')?.value);
};
