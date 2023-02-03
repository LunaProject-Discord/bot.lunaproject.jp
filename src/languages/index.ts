import { Translation } from '../interfaces/language';
import En from './translations/en';
import Ja from './translations/ja';

export const getTranslationByName = (language: string | undefined): Translation => {
    switch (language) {
        case 'en':
            return En;
        default:
            return Ja;
    }
};
