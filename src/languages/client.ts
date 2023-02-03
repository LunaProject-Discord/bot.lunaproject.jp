'use client';

import { parseCookies } from 'nookies';
import { Translation } from '../interfaces/language';
import { getTranslationByName } from './index';

export const useTranslation = (): Translation => {
    const cookies = parseCookies();
    return getTranslationByName(cookies['language']);
};
